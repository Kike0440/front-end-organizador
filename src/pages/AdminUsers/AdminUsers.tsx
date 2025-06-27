import React, { useState, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import type { User } from '../../types/Local';
import { initialMockUsers } from '../../data/mockLocals';
import { Users, MagnifyingGlass, FunnelSimple, PencilSimple, Trash, PlusCircle } from 'phosphor-react';
import Swal from 'sweetalert2';
import styles from './AdminUsers.module.scss';
import UserFormModal from '../../components/Modals/UserFormModal/UserFormModal';
const generateUniqueId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useLocalStorage<User[]>('appUsers', initialMockUsers);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'employee'>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filtrar y buscar usuarios usando useMemo
  const filteredAndSearchedUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'all' || user.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Funciones placeholder para editar y eliminar
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userToDelete: User) => {
    const adminUsers = users.filter(u => u.role === 'admin');
    if (userToDelete.role === 'admin' && adminUsers.length === 1 && adminUsers[0].id === userToDelete.id) {
        Swal.fire({
            title: 'Error',
            text: 'No puedes eliminar al único administrador del sistema.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#4a6079',
            background: '#E2E0C8',
            color: '#4E635E'
        });
        return;
    }
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar al usuario ${userToDelete.name}. ¡No podrás revertir esto!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a64d56',
      cancelButtonColor: '#4a6079',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#E2E0C8',
      color: '#4E635E'
    });

    if (result.isConfirmed) {
      setUsers(users.filter(user => user.id !== userToDelete.id));
      Swal.fire({
        title: '¡Eliminado!',
        text: `El usuario ${userToDelete.name} ha sido eliminado.`,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        background: '#E2E0C8',
        color: '#4E635E'
      });
    }
  };

  const handleUserSubmit = (userData: Omit<User, 'id'> & { id?: string }) => {
    if (userData.id) {
      // Modo edición
      setUsers(users.map(u => (u.id === userData.id ? { ...u, ...userData, password: userData.password || u.password } : u)));
      Swal.fire({
        title: '¡Actualizado!',
        text: 'El usuario ha sido actualizado correctamente.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        background: '#E2E0C8',
        color: '#4E635E'
      });
    } else {
      // Modo creación
      const newUser: User = { ...userData, id: generateUniqueId() } as User;
      setUsers([...users, newUser]);
      Swal.fire({
        title: '¡Creado!',
        text: 'El nuevo usuario ha sido creado correctamente.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        background: '#E2E0C8',
        color: '#4E635E'
      });
    }
  };

  return (
    <div className={styles['admin-users']}>
      <h2 className={styles['admin-users__title']}>
        <Users size={32} weight="duotone" /> Gestión de Usuarios
      </h2>

      <div className={styles['admin-users__controls']}>
        <div className={styles['admin-users__search-filter']}>
            <div className={styles['admin-users__search-box']}>
                <MagnifyingGlass size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles['admin-users__search-input']}
                />
            </div>
            <div className={styles['admin-users__filter-box']}>
                <FunnelSimple size={20} />
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'employee')}
                    className={styles['admin-users__filter-select']}
                >
                    <option value="all">Todos los Roles</option>
                    <option value="admin">Administrador</option>
                    <option value="employee">Empleado</option>
                </select>
            </div>
        </div>
        <button onClick={handleAddUser} className={styles['admin-users__add-button']}>
            <PlusCircle size={20} /> Añadir Usuario
        </button>
      </div>

      <div className={styles['admin-users__table-container']}>
        {filteredAndSearchedUsers.length === 0 ? (
          <p className={styles['admin-users__no-results']}>No se encontraron usuarios que coincidan con la búsqueda o el filtro.</p>
        ) : (
          <table className={styles['admin-users__table']}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSearchedUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${styles['admin-users__role-badge']} ${styles[`admin-users__role-badge--${user.role}`]}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Empleado'}
                    </span>
                  </td>
                  <td>
                    <div className={styles['admin-users__actions']}>
                      <button
                        onClick={() => handleEdit(user)}
                        className={`${styles['admin-users__action-button']} ${styles['admin-users__action-button--edit']}`}
                        title="Editar Usuario"
                      >
                        <PencilSimple size={28} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className={`${styles['admin-users__action-button']} ${styles['admin-users__action-button--delete']}`}
                        title="Eliminar Usuario"
                      >
                        <Trash size={28} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUserSubmit}
        editingUser={editingUser}
      />
    </div>
  );
};

export default AdminUsers;