import React, { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { Local } from '../../types/Local';
import { initialMockLocals } from '../../data/mockLocals';
// Phosphor Icons
import {
    PlusCircle,
    PencilSimple,
    Trash,
    Buildings,
    Wrench,
    XCircle,
    CheckCircle,
    MagnifyingGlass,
    FunnelSimple
} from 'phosphor-react';

import styles from './AdminManagement.module.scss';
import Swal from 'sweetalert2';

const generateUniqueId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

const AdminManagement: React.FC = () => {
  const [locals, setLocals] = useLocalStorage<Local[]>('commercialLocals', initialMockLocals);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocal, setEditingLocal] = useState<Local | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Local['status'] | 'all'>('all');


  const [formState, setFormState] = useState<Omit<Local, 'id'>>({
    name: '',
    address: '',
    price: 0,
    status: 'available',
    description: '',
    imageUrl: '',
    sizeSqMeters: 0,
  });

  const handleAddClick = () => {
    setEditingLocal(null);
    setFormState({
      name: '', address: '', price: 0, status: 'available', description: '', imageUrl: '', sizeSqMeters: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (local: Local) => {
    setEditingLocal(local);
    setFormState({
      name: local.name,
      address: local.address,
      price: local.price,
      status: local.status,
      description: local.description || '',
      imageUrl: local.imageUrl || '',
      sizeSqMeters: local.sizeSqMeters || 0,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = (type === 'number') ? parseFloat(value) : value;
    setFormState({ ...formState, [name]: newValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLocal) {
      setLocals(locals.map(loc =>
        loc.id === editingLocal.id ? { ...loc, ...formState } : loc
      ));
    } else {
      const newLocal: Local = { ...formState, id: generateUniqueId() };
      setLocals([...locals, newLocal]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4E635E',
      cancelButtonColor: '#818C78',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setLocals(locals.filter(local => local.id !== id));
      Swal.fire(
        '¡Eliminado!',
        'El local ha sido eliminado.',
        'success'
      );
    }
  };

  const filteredLocals = locals.filter(local => {
    const matchesSearch = local.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          local.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (local.description && local.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' || local.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: Local['status']) => {
    switch (status) {
      case 'available': return <CheckCircle size={20} color="#28a745" weight="fill" />; // Verde
      case 'rented': return <XCircle size={20} color="#dc3545" weight="fill" />; // Rojo
      case 'maintenance': return <Wrench size={20} color="#ffc107" weight="fill" />; // Amarillo
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

  return (
    <div className={styles['admin-management']}>
      <h2 className={styles['admin-management__title']}>
        <Buildings size={32} weight="duotone" /> Gestión de Locales
      </h2>

      <div className={styles['admin-management__controls']}>
        <div className={styles['admin-management__search-filter']}>
          <div className={styles['admin-management__search-box']}>
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, dirección o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles['admin-management__search-input']}
            />
          </div>
          <div className={styles['admin-management__filter-box']}>
            <FunnelSimple size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Local['status'] | 'all')}
              className={styles['admin-management__filter-select']}
            >
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="rented">Rentado</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>
        </div>
        <button onClick={handleAddClick} className={styles['admin-management__add-button']}>
          <PlusCircle size={24} /> Nuevo Local
        </button>
      </div>

      <div className={styles['admin-management__locals-grid']}>
        {filteredLocals.length === 0 ? (
          <p className={styles['admin-management__no-results']}>No se encontraron locales.</p>
        ) : (
          filteredLocals.map(local => (
            <div key={local.id} className={styles['admin-management__local-card']}>
              <img src={local.imageUrl} alt={local.name} className={styles['admin-management__local-image']} />
              <div className={styles['admin-management__local-info']}>
                <h3 className={styles['admin-management__local-name']}>{local.name}</h3>
                <p className={styles['admin-management__local-address']}>{local.address}</p>
                <p className={styles['admin-management__local-price']}>${local.price.toLocaleString()} / mes</p>
                <p className={`${styles['admin-management__local-status']} ${styles[`admin-management__local-status--${local.status}`]}`}>
                  {getStatusIcon(local.status)} {getStatusText(local.status)}
                </p>
                {local.sizeSqMeters && <p className={styles['admin-management__local-size']}>Tamaño: {local.sizeSqMeters} m²</p>}
                {local.description && <p className={styles['admin-management__local-description']}>{local.description}</p>}
                <div className={styles['admin-management__local-actions']}>
                  <button onClick={() => handleEditClick(local)} className={styles['admin-management__edit-button']}>
                    <PencilSimple size={20} /> Editar
                  </button>
                  <button onClick={() => handleDeleteClick(local.id)} className={styles['admin-management__delete-button']}>
                    <Trash size={20} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para Añadir/Editar Local */}
      {isModalOpen && (
        <div className={styles['admin-management__modal-overlay']}>
          <div className={styles['admin-management__modal']}>
            <h3 className={styles['admin-management__modal-title']}>{editingLocal ? 'Editar Local' : 'Añadir Nuevo Local'}</h3>
            <form onSubmit={handleSubmit} className={styles['admin-management__form']}>
              <div className={styles['admin-management__form-group']}>
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" value={formState.name} onChange={handleFormChange} required className={styles['admin-management__form-input']} />
              </div>
              <div className={styles['admin-management__form-group']}>
                <label htmlFor="address">Dirección:</label>
                <input type="text" id="address" name="address" value={formState.address} onChange={handleFormChange} required className={styles['admin-management__form-input']} />
              </div>
              <div className={styles['admin-management__form-group']}>
                <label htmlFor="price">Precio Mensual:</label>
                <input type="number" id="price" name="price" value={formState.price} onChange={handleFormChange} required min="0" className={styles['admin-management__form-input']} />
              </div>
              <div className={styles['admin-management__form-group']}>
                <label htmlFor="status">Estado:</label>
                <select id="status" name="status" value={formState.status} onChange={handleFormChange} className={styles['admin-management__form-select']}>
                  <option value="available">Disponible</option>
                  <option value="rented">Rentado</option>
                  <option value="maintenance">En Mantenimiento</option>
                </select>
              </div>
              <div className={styles['admin-management__form-group']}>
                <label htmlFor="description">Descripción:</label>
                <textarea id="description" name="description" value={formState.description} onChange={handleFormChange} rows={3} className={styles['admin-management__form-textarea']}></textarea>
              </div>
              <div className={styles['admin-management__form-group']}>
                <label htmlFor="imageUrl">URL de Imagen:</label>
                <input type="text" id="imageUrl" name="imageUrl" value={formState.imageUrl} onChange={handleFormChange} className={styles['admin-management__form-input']} />
              </div>
              <div className={styles['admin-management__form-group']}>
                <label htmlFor="sizeSqMeters">Tamaño (m²):</label>
                <input type="number" id="sizeSqMeters" name="sizeSqMeters" value={formState.sizeSqMeters} onChange={handleFormChange} min="0" className={styles['admin-management__form-input']} />
              </div>
              <div className={styles['admin-management__modal-actions']}>
                <button type="submit" className={styles['admin-management__modal-save']}>
                  {editingLocal ? 'Guardar Cambios' : 'Añadir Local'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles['admin-management__modal-cancel']}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;