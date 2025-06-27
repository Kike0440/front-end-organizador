import React, { useState, useEffect } from 'react';
import type { User } from '../../../types/Local';
import styles from './UserFormModal.module.scss';
//import { XCircle } from 'phosphor-react';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id'> & { id?: string }) => void;
  editingUser: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const [formState, setFormState] = useState<Omit<User, 'id'> & { id?: string }>({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });

  useEffect(() => {
    if (editingUser) {
      setFormState({
        id: editingUser.id,
        name: editingUser.name,
        email: editingUser.email,
        password: '',
        role: editingUser.role,
      });
    } else {
      setFormState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
      });
    }
  }, [editingUser, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.role || (!editingUser && !formState.password)) {
      alert('Por favor, completa todos los campos requeridos (y la contraseña para nuevos usuarios).');
      return;
    }
    onSubmit(formState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        {/*<button className={styles['modal-close-button']} onClick={onClose} title="Cerrar">
          <XCircle size={24} weight="bold" />
        </button>*/}
        <h2 className={styles['modal-title']}>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit} className={styles['modal-form']}>
          <div className={styles['form-group']}>
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>
          {!editingUser && (
            <div className={styles['form-group']}>
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className={styles['form-group']}>
            <label htmlFor="role">Rol:</label>
            <select
              id="role"
              name="role"
              value={formState.role}
              onChange={handleChange}
              required
            >
              <option value="employee">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className={styles['modal-actions']}>
            <button type="submit" className={styles['submit-button']}>
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
            <button type="button" onClick={onClose} className={styles['cancel-button']}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;