import React, { useState, useEffect } from 'react';
import type { Expense } from '../../../types/index';
import styles from './ExpenseFormModal.module.scss';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id'> & { id?: string }) => void;
  editingExpense: Expense | null;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ isOpen, onClose, onSubmit, editingExpense }) => {
  const [formState, setFormState] = useState<Omit<Expense, 'id'> & { id?: string }>({
    description: '',
    amount: 0,
    date: new Date().toISOString().substring(0, 10),
    category: 'maintenance',
    localId: '',
  });

  useEffect(() => {
    if (editingExpense) {
      setFormState({
        id: editingExpense.id,
        description: editingExpense.description,
        amount: editingExpense.amount,
        date: editingExpense.date,
        category: editingExpense.category,
        localId: editingExpense.localId || '',
      });
    } else {
      setFormState({
        description: '',
        amount: 0,
        date: new Date().toISOString().substring(0, 10),
        category: 'maintenance',
        localId: '',
      });
    }
  }, [editingExpense, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: name === 'amount' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.description || formState.amount <= 0 || !formState.date || !formState.category) {
      alert('Por favor, completa todos los campos requeridos y asegúrate de que el monto sea mayor a 0.');
      return;
    }
    onSubmit(formState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h2 className={styles['modal-title']}>{editingExpense ? 'Editar Gasto' : 'Añadir Nuevo Gasto'}</h2>
        <form onSubmit={handleSubmit} className={styles['modal-form']}>
          <div className={styles['form-group']}>
            <label htmlFor="description">Descripción:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="amount">Monto:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formState.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="date">Fecha:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formState.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="category">Categoría:</label>
            <select
              id="category"
              name="category"
              value={formState.category}
              onChange={handleChange}
              required
            >
              <option value="maintenance">Mantenimiento</option>
              <option value="utility">Servicios</option>
              <option value="administrative">Administrativo</option>
              <option value="salary">Salarios</option>
              <option value="marketing">Marketing</option>
              <option value="other">Otros</option>
            </select>
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="localId">ID del Local (Opcional):</label>
            <input
              type="text"
              id="localId"
              name="localId"
              value={formState.localId}
              onChange={handleChange}
              placeholder="Ej: l1, l2 (si aplica)"
            />
          </div>
          <div className={styles['modal-actions']}>
            <button type="submit" className={styles['submit-button']}>
              {editingExpense ? 'Guardar Cambios' : 'Añadir Gasto'}
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

export default ExpenseFormModal;