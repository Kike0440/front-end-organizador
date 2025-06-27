import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserCircle, Buildings, FileText, CalendarCheck, CreditCard, EnvelopeSimple } from 'phosphor-react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Local, User, Contract, RentedLocalInfo } from '../../types/Local';
import styles from './EmployeeProfile.module.scss';

const EmployeeProfile: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser] = useLocalStorage<User | null>('currentUser', null);
  const [allLocals] = useLocalStorage<Local[]>('commercialLocals', []);
  const [allContracts] = useLocalStorage<Contract[]>('commercialContracts', []);

  const [rentedLocalsInfo, setRentedLocalsInfo] = useState<RentedLocalInfo[]>([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'employee') {
        console.log('No hay un usuario logueado o no es un empleado.');
      return;
    }

    const employeeContracts = allContracts.filter(contract => contract.userId === currentUser.id);

    const rentedInfo: RentedLocalInfo[] = employeeContracts.map(contract => {
      const local = allLocals.find(loc => loc.id === contract.localId);

      if (local) {
        const today = new Date();
        const contractStartDate = new Date(contract.startDate);
        const contractEndDate = new Date(contract.endDate);
        let nextPaymentDate = '';
        let paymentStatus: RentedLocalInfo['paymentStatus'] = 'paid';

        if (today < contractStartDate) {
          paymentStatus = 'pending';
          nextPaymentDate = contract.startDate;
        } else if (today > contractEndDate) {
          paymentStatus = 'overdue';
          nextPaymentDate = contract.endDate;
        } else {
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(today.getDate() + 7);

          if (contractEndDate <= sevenDaysFromNow) {
            paymentStatus = 'dueSoon';
            nextPaymentDate = contract.endDate;
          } else {
            nextPaymentDate = 'Próximo pago desconocido (mock)'; // Placeholder
          }
        }

        return {
          ...local,
          contractId: contract.id,
          contractStartDate: contract.startDate,
          contractEndDate: contract.endDate,
          rentAmountContract: contract.rentAmount,
          paymentFrequency: contract.paymentFrequency,
          nextPaymentDate: nextPaymentDate,
          paymentStatus: paymentStatus,
        };
      }
      return null;
    }).filter(Boolean) as RentedLocalInfo[];

    setRentedLocalsInfo(rentedInfo);
  }, [currentUser, allLocals, allContracts]);

  const handleViewContract = (contractId: string) => {
    Swal.fire({
      title: 'Contrato Digital',
      html: `
        <p style="text-align: left">
            <strong>Contrato ID:</strong>
            ${contractId}
        </p>
        <br />
        <p style="text-align: justify">
            Aquí se mostraría el contenido real
            del contrato o un enlace para descargarlo.
        </p>
        <br />
        <p>¡Esto es solo una simulación!</p>
      `,
      confirmButtonText: 'Cerrar',
      background: '#E2E0C8',
      color: '#4E635E',
      confirmButtonColor: '#4E635E'
    });
  };

  const handleViewPayments = (localName: string, contractId: string) => {
    Swal.fire({
      title: `Historial de Pagos de ${localName}`,
      html: `
        <p style="text-align: left">
            <strong>Contrato ID:</strong>
            ${contractId}
        </p>
        <br />
        <p style="text-align: justify">
            Aquí se mostraría una tabla con fechas,
            montos y estados de pagos anteriores.
        </p>
        <br />
        <p>¡Esto es solo una simulación!</p>
      `,
      confirmButtonText: 'Cerrar',
      background: '#E2E0C8',
      color: '#4E635E',
      confirmButtonColor: '#4E635E'
    });
  };

  const dateFormat = (dateString: string) => {
    // convert date string in format YYYY-MM-DD to a DD-MONTH-YYYY format
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-MX', options);
  }

  if (!currentUser) {
    return <p className={styles['employee-profile__loading']}>
        Cargando perfil o no hay sesión iniciada...
    </p>;
  }

  return (
    <div className={styles['employee-profile']}>
      <h2 className={styles['employee-profile__title']}>
        <UserCircle size={32} weight="duotone" /> Mi Perfil de Empleado
      </h2>

      <div className={styles['employee-profile__section']}>
        <h3 className={styles['employee-profile__section-title']}>
          <UserCircle size={24} weight="fill" /> Información Personal
        </h3>
        <p><strong>Nombre:</strong> {currentUser.name}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
      </div>

      <div className={styles['employee-profile__card']}>
        <div className={styles['employee-profile__section']}>
            <h3 className={styles['employee-profile__section-title']}>
            <Buildings size={24} weight="fill" /> Mis Locales Rentados
            </h3>
            {rentedLocalsInfo.length === 0 ? (
            <p className={styles['employee-profile__no-rentals']}>Actualmente no tienes locales rentados a tu nombre.</p>
            ) : (
            <div className={styles['employee-profile__rentals-grid']}>
                {rentedLocalsInfo.map(local => (
                <div key={local.id} className={styles['employee-profile__rental-card']}>
                    <img
                    src={local.imageUrl || 'https://via.placeholder.com/200x150/cccccc/333333?text=Local'}
                    alt={local.name}
                    className={styles['employee-profile__rental-image']}
                    />
                    <div className={styles['employee-profile__rental-info']}>
                    <h4 className={styles['employee-profile__rental-name']}>{local.name}</h4>
                    <p className={styles['employee-profile__rental-address']}>{local.address}</p>
                    <p><strong>Renta
                        <span>
                            {local.paymentFrequency === 'monthly' && ' mensual'}
                            {local.paymentFrequency === 'quarterly' && ' trimestral'}
                            {local.paymentFrequency === 'yearly' && ' anual'}
                        </span>:
                    </strong>
                        &nbsp;${local.rentAmountContract.toLocaleString()} MXN  
                    </p>
                    <p><strong>Contrato:</strong> del {dateFormat(local.contractStartDate)} al {dateFormat(local.contractEndDate)}</p>

                    <div className={`${styles['employee-profile__payment-status']} ${styles[`employee-profile__payment-status--${local.paymentStatus}`]}`}>
                        <CalendarCheck size={18} />
                        <strong>Estado:</strong>
                        <span className={styles['employee-profile__status-badge']}>
                            {local.paymentStatus === 'paid' && 'Al día'}
                            {local.paymentStatus === 'pending' && 'Pendiente de inicio'}
                            {local.paymentStatus === 'dueSoon' && 'Vence pronto'}
                            {local.paymentStatus === 'overdue' && 'Vencido'}
                        </span>
                        {local.nextPaymentDate && <p>Próximo pago: {local.nextPaymentDate}</p>}
                    </div>

                    <div className={styles['employee-profile__rental-actions']}>
                        <button onClick={() => handleViewContract(local.contractId)} className={styles['employee-profile__action-button']}>
                        <FileText size={20} /> Ver Contrato
                        </button>
                        <button onClick={() => handleViewPayments(local.name, local.contractId)} className={styles['employee-profile__action-button']}>
                        <CreditCard size={20} /> Ver Pagos
                        </button>
                        <button
                            onClick={() => navigate(`/employee/contact-admin?localId=${local.id}&localName=${encodeURIComponent(local.name)}`)}
                            className={styles['employee-profile__action-button']}
                        >
                            <EnvelopeSimple size={20} /> Contactar
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;