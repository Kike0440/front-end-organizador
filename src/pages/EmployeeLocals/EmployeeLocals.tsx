import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Local } from '../../types/Local';
import { initialMockLocals } from '../../data/mockLocals';
import {
  Buildings,
  MagnifyingGlass,
  FunnelSimple,
  CheckCircle,
  XCircle,
  Wrench,
  Info,
  Envelope,
  CalendarCheck
} from 'phosphor-react';
import styles from './EmployeeLocals.module.scss';
import { useNavigate } from 'react-router-dom';


const EmployeeLocals: React.FC = () => {
  const [locals] = useLocalStorage<Local[]>('commercialLocals', initialMockLocals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Local['status'] | 'all'>('all');
  const navigate = useNavigate();

  const filteredLocals = locals.filter(local => {
    const matchesSearch = local.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          local.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (local.description && local.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' || local.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: Local['status']) => {
    switch (status) {
      case 'available': return <CheckCircle size={20} color="#28a745" weight="fill" />;
      case 'rented': return <XCircle size={20} color="#dc3545" weight="fill" />;
      case 'maintenance': return <Wrench size={20} color="#ffc107" weight="fill" />;
      default: return null;
    }
  };

  const getStatusText = (status: Local['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'rented': return 'Rentado';
      case 'maintenance': return 'En Mantenimiento';
      default: return '';
    }
  };

  const handleContactAdmin = (localName: string, localId: string) => {
    console.log(`Contactar al admin por el local: ${localName} (ID: ${localId})`);
    navigate(`/employee/contact-admin?localId=${localId}&localName=${encodeURIComponent(localName)}`);
  };

  const handleScheduleAppointment = (localName: string, localId: string) => {
    console.log(`Agendar cita para el local: ${localName} (ID: ${localId})`);
    navigate(`/employee/schedule-appointment?localId=${localId}&localName=${encodeURIComponent(localName)}`);
  };

  return (
    <div className={styles['employee-locals']}>
      <h2 className={styles['employee-locals__title']}>
        <Buildings size={32} weight="duotone" /> Mis Locales Asignados
      </h2>

      <div className={styles['employee-locals__controls']}>
        <div className={styles['employee-locals__search-filter']}>
          <div className={styles['employee-locals__search-box']}>
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, dirección o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles['employee-locals__search-input']}
            />
          </div>
          <div className={styles['employee-locals__filter-box']}>
            <FunnelSimple size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Local['status'] | 'all')}
              className={styles['employee-locals__filter-select']}
            >
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="rented">Rentado</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles['employee-locals__locals-grid']}>
        {filteredLocals.length === 0 ? (
          <p className={styles['employee-locals__no-results']}>No se encontraron locales que coincidan con la búsqueda o filtro.</p>
        ) : (
          filteredLocals.map(local => (
            <div key={local.id} className={styles['employee-locals__local-card']}>
              <img src={local.imageUrl || 'https://via.placeholder.com/300x200/cccccc/333333?text=Local'} alt={local.name} className={styles['employee-locals__local-image']} />
              <div className={styles['employee-locals__local-info']}>
                <h3 className={styles['employee-locals__local-name']}>{local.name}</h3>
                <p className={styles['employee-locals__local-address']}>{local.address}</p>
                <p className={styles['employee-locals__local-price']}>${local.price.toLocaleString()} / mes</p>
                <p className={`${styles['employee-locals__local-status']} ${styles[`employee-locals__local-status--${local.status}`]}`}>
                  {getStatusIcon(local.status)} {getStatusText(local.status)}
                </p>
                {local.sizeSqMeters && <p className={styles['employee-locals__local-size']}>Tamaño: {local.sizeSqMeters} m²</p>}
                {local.description && <p className={styles['employee-locals__local-description']}>{local.description}</p>}
                <div className={styles['employee-locals__local-actions']}>
                  <button
                    onClick={() => navigate(`/employee/locals/${local.id}`)}
                    className={styles['employee-locals__details-button']}>
                    <Info size={20} /> Ver Detalles
                  </button>
                  {/* Botón de Contactar al Admin */}
                  <button
                    onClick={() => handleContactAdmin(local.name, local.id)}
                    className={styles['employee-locals__details-button']}
                    disabled={local.status !== 'available'}
                  >
                    <Envelope size={20} /> Contactar
                  </button>

                  {/* Botón de Agendar Cita */}
                  <button
                    onClick={() => handleScheduleAppointment(local.name, local.id)}
                    className={styles['employee-locals__details-button']}
                    disabled={local.status !== 'available'}
                  >
                    <CalendarCheck size={20} /> Agendar Cita
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeLocals;