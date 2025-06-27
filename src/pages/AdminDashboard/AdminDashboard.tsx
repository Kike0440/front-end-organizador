import React, { useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Local, User, Contract } from '../../types/Local';
import type { Expense } from '../../types/index';
import {
  Buildings,
  FileText,
  Users,
  HouseSimple,
  ChartPieSlice,
  CalendarPlus,
  ShieldCheck,
  Wrench,
  CurrencyDollar,
  TrendUp,
  TrendDown
} from 'phosphor-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './AdminDashboard.module.scss';

const AdminDashboard: React.FC = () => {
  const [locals] = useLocalStorage<Local[]>('commercialLocals', []);
  const [users] = useLocalStorage<User[]>('appUsers', []);
  const [contracts] = useLocalStorage<Contract[]>('commercialContracts', []);
  const [expenses] = useLocalStorage<Expense[]>('appExpenses', []);

  const dashboardStats = useMemo(() => {
    const currentYearMonth = new Date().toISOString().substring(0, 7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalLocals = locals.length;
    const availableLocals = locals.filter(local => local.status === 'available').length;
    const rentedLocals = locals.filter(local => local.status === 'rented').length;
    const maintenanceLocals = locals.filter(local => local.status === 'maintenance').length;

    const totalContracts = contracts.length;

    const activeContractsList = contracts.filter(contract => {
      const startDate = new Date(contract.startDate);
      const endDate = new Date(contract.endDate);
      return today >= startDate && today <= endDate;
    });
    const activeContractsCount = activeContractsList.length;


    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const contractsEndingSoon = contracts.filter(contract => {
      const endDate = new Date(contract.endDate);
      return endDate > today && endDate <= thirtyDaysFromNow;
    }).length;

    const pendingContracts = contracts.filter(contract => {
      const startDate = new Date(contract.startDate);
      return startDate > today;
    }).length;

    const monthlyRevenue = activeContractsList.reduce((sum, contract) => sum + contract.rentAmount, 0);
    const monthlyExpenses = expenses.reduce((sum, expense) => {
      const expenseMonth = expense.date.substring(0, 7);
      if (expenseMonth === currentYearMonth) {
        return sum + expense.amount;
      }
      return sum;
    }, 0);

    const employeeUsers = users.filter(user => user.role === 'employee').length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const totalAppUsers = users.length;

    const balanceChartData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toISOString().substring(0, 7);
      const monthName = date.toLocaleString('es-ES', { month: 'short', year: '2-digit' });

      let monthRevenue = 0;
      // Recorrer TODOS los contratos para obtener ingresos de meses pasados
      contracts.forEach(contract => {
        const startDate = new Date(contract.startDate);
        const endDate = new Date(contract.endDate);
        // Si el contrato estuvo activo en cualquier momento de este 'monthYear'
        if (startDate.toISOString().substring(0, 7) <= monthYear && endDate.toISOString().substring(0, 7) >= monthYear) {
          if (contract.paymentFrequency === 'yearly') {
            monthRevenue += contract.rentAmount / 12;
          }else if (contract.paymentFrequency === 'quarterly') {
            monthRevenue += contract.rentAmount / 3;
          }else {
            monthRevenue += contract.rentAmount;
          }
        }
      });

      let monthExpenses = 0;
      expenses.forEach(expense => {
        if (expense.date.substring(0, 7) === monthYear) {
          monthExpenses += expense.amount;
        }
      });

      balanceChartData.push({
        name: monthName,
        Ingresos: monthRevenue,
        Gastos: monthExpenses,
        Balance: monthRevenue - monthExpenses,
      });
    }

    return {
      totalLocals,
      availableLocals,
      rentedLocals,
      maintenanceLocals,
      totalContracts,
      activeContracts: activeContractsCount,
      contractsEndingSoon,
      pendingContracts,
      monthlyRevenue,
      monthlyExpenses,
      employeeUsers,
      adminUsers,
      totalAppUsers,
      balanceChartData,
    };
  }, [locals, users, contracts, expenses]);

  return (
    <div className={styles['admin-dashboard']}>
      <h2 className={styles['admin-dashboard__title']}>
        <ChartPieSlice size={32} weight="duotone" /> Dashboard del Administrador
      </h2>

      {/* Sección de Finanzas */}
      <div className={styles['admin-dashboard__section']}>
        <h3 className={styles['admin-dashboard__section-title']}>
          <CurrencyDollar size={24} weight="fill" /> Resumen Financiero
        </h3>
        <div className={styles['admin-dashboard__cards-grid']}>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--revenue']}`}>
            <TrendUp size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Ingresos Mensuales Estimados</p>
            <p className={styles['dashboard-card__value']}>${dashboardStats.monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--expenses']}`}>
            <TrendDown size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Gastos Mensuales Totales</p>
            <p className={styles['dashboard-card__value']}>${dashboardStats.monthlyExpenses.toLocaleString()}</p>
          </div>
        </div>
        {/* FUTURO: Sección para la Gráfica de Balance */}
        <div className={styles['admin-dashboard__chart-section']}>
          <h4>Balance de Ingresos vs. Gastos (Últimos 6 meses)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dashboardStats.balanceChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fill: '#555' }} />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} tick={{ fill: '#555' }} />
              <Tooltip
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
                labelFormatter={(label) => `Mes: ${label}`}
                contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderColor: '#e0e0e0' }}
                itemStyle={{ color: '#333' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Ingresos" fill="#587647" name="Ingresos" />
              <Bar dataKey="Gastos" fill="#c5813c" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sección de Resumen de Locales (sin cambios) */}
      <div className={styles['admin-dashboard__section']}>
        <h3 className={styles['admin-dashboard__section-title']}>
          <Buildings size={24} weight="fill" /> Resumen de Locales
        </h3>
        <div className={styles['admin-dashboard__cards-grid']}>
          <div className={styles['dashboard-card']}>
            <HouseSimple size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Total de Locales</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.totalLocals}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--available']}`}>
            <ShieldCheck size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Locales Disponibles</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.availableLocals}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--rented']}`}>
            <FileText size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Locales Rentados</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.rentedLocals}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--maintenance']}`}>
            <Wrench size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>En Mantenimiento</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.maintenanceLocals}</p>
          </div>
        </div>
      </div>

      {/* Sección de Resumen de Contratos */}
      <div className={styles['admin-dashboard__section']}>
        <h3 className={styles['admin-dashboard__section-title']}>
          <FileText size={24} weight="fill" /> Resumen de Contratos
        </h3>
        <div className={styles['admin-dashboard__cards-grid']}>
          <div className={styles['dashboard-card']}>
            <FileText size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Total de Contratos</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.totalContracts}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--active']}`}>
            <CalendarPlus size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Contratos Activos</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.activeContracts}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--ending-soon']}`}>
            <CalendarPlus size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Terminan Pronto (30 días)</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.contractsEndingSoon}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--pending']}`}>
            <CalendarPlus size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Contratos Pendientes</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.pendingContracts}</p>
          </div>
        </div>
      </div>

      {/* Sección de Resumen de Usuarios */}
      <div className={styles['admin-dashboard__section']}>
        <h3 className={styles['admin-dashboard__section-title']}>
          <Users size={24} weight="fill" /> Resumen de Usuarios
        </h3>
        <div className={styles['admin-dashboard__cards-grid']}>
          <div className={styles['dashboard-card']}>
            <Users size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Total Usuarios App</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.totalAppUsers}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--employee']}`}>
            <Users size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Usuarios Empleados</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.employeeUsers}</p>
          </div>
          <div className={`${styles['dashboard-card']} ${styles['dashboard-card--admin']}`}>
            <Users size={40} weight="duotone" />
            <p className={styles['dashboard-card__title']}>Usuarios Administradores</p>
            <p className={styles['dashboard-card__value']}>{dashboardStats.adminUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;