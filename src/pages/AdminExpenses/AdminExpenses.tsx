import React, { useState, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Expense } from '../../types/index';
import { initialMockExpenses } from '../../data/mockLocals';
import { Receipt, MagnifyingGlass, FunnelSimple, PencilSimple, Trash, PlusCircle } from 'phosphor-react';
import Swal from 'sweetalert2';
import styles from './AdminExpenses.module.scss';
import ExpenseFormModal from '../../components/Modals/ExpenseFormModal/ExpenseFormModal';

const AdminExpenses: React.FC = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('appExpenses', initialMockExpenses);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<'all' | Expense['category']>('all');
  const [filterMonth, setFilterMonth] = useState<string>(new Date().toISOString().substring(0, 7));
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const generateUniqueId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

  const filteredAndSearchedExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;

      const expenseMonth = expense.date.substring(0, 7);
      const matchesMonth = filterMonth === 'all' || expenseMonth === filterMonth;

      return matchesSearch && matchesCategory && matchesMonth;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchTerm, filterCategory, filterMonth]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expenseToEdit: Expense) => {
    setEditingExpense(expenseToEdit);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (expenseToDelete: Expense) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar el gasto: "${expenseToDelete.description}" por $${expenseToDelete.amount.toLocaleString()}. ¡No podrás revertir esto!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#A64D56',
      cancelButtonColor: '#4a6079',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#E2E0C8',
      color: '#4E635E'
    });

    if (result.isConfirmed) {
      setExpenses(expenses.filter(exp => exp.id !== expenseToDelete.id));
      Swal.fire({
        title: '¡Eliminado!',
        icon: 'success',
        background: '#E2E0C8',
        color: '#4E635E',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleExpenseSubmit = (expenseData: Omit<Expense, 'id'> & { id?: string }) => {
    if (expenseData.id) {
      setExpenses(expenses.map(exp => (exp.id === expenseData.id ? { ...exp, ...expenseData } : exp)));
      Swal.fire({
        title: '¡Actualizado!',
        text: 'El gasto ha sido actualizado correctamente.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        background: '#E2E0C8',
        color: '#4E635E'
      });
    } else {
      const newExpense: Expense = { ...expenseData, id: generateUniqueId() } as Expense;
      setExpenses([...expenses, newExpense]);
      Swal.fire({
        title: '¡Añadido!',
        text: 'El nuevo gasto ha sido añadido correctamente.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        background: '#E2E0C8',
        color: '#4E635E'
      });
    }
  };
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    expenses.forEach(exp => {
      months.add(exp.date.substring(0, 7));
    });
    const sortedMonths = Array.from(months).sort().reverse();
    return ['all', ...sortedMonths];
  }, [expenses]);


  return (
    <div className={styles['admin-expenses']}>
      <h2 className={styles['admin-expenses__title']}>
        <Receipt size={32} weight="duotone" /> Gestión de Gastos
      </h2>

      <div className={styles['admin-expenses__controls']}>
        {/* Barra de búsqueda */}
        <div className={styles['admin-expenses__search']}>
            <MagnifyingGlass size={20} />
            <input
                type="text"
                placeholder="Buscar por descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles['admin-expenses__search-input']}
            />
        </div>

        {/* Filtro por categoría */}
        <div className={styles['admin-expenses__filter']}>
          <FunnelSimple size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as 'all' | Expense['category'])}
            className={styles['admin-expenses__filter-select']}
          >
            <option value="all">Todas las Categorías</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="utility">Servicios</option>
            <option value="administrative">Administrativo</option>
            <option value="salary">Salarios</option>
            <option value="marketing">Marketing</option>
            <option value="other">Otros</option>
          </select>
        </div>

        {/* Filtro por Mes */}
        <div className={styles['admin-expenses__filter']}>
          <FunnelSimple size={20} />
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className={styles['admin-expenses__filter-select']}
          >
            <option value="all">Todos los Meses</option>
            {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>


        {/* Botón para añadir gasto */}
        <button onClick={handleAddExpense} className={styles['admin-expenses__add-button']}>
          <PlusCircle size={20} /> Añadir Gasto
        </button>
      </div>

      <div className={styles['admin-expenses__table-container']}>
        {filteredAndSearchedExpenses.length === 0 ? (
          <p className={styles['admin-expenses__no-results']}>No se encontraron gastos que coincidan con la búsqueda o el filtro.</p>
        ) : (
          <table className={styles['admin-expenses__table']}>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Local ID</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSearchedExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>${expense.amount.toLocaleString()}</td>
                  <td>{expense.date}</td>
                  <td>
                    <span className={`${styles['admin-expenses__category-badge']} ${styles[`admin-expenses__category-badge--${expense.category}`]}`}>
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </span>
                  </td>
                  <td>{expense.localId || 'N/A'}</td>
                  <td>
                    <div className={styles['admin-expenses__actions']}>
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className={`${styles['admin-expenses__action-button']} ${styles['admin-expenses__action-button--edit']}`}
                        title="Editar Gasto"
                      >
                        <PencilSimple size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense)}
                        className={`${styles['admin-expenses__action-button']} ${styles['admin-expenses__action-button--delete']}`}
                        title="Eliminar Gasto"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleExpenseSubmit}
        editingExpense={editingExpense}
      />
    </div>
  );
};

export default AdminExpenses;