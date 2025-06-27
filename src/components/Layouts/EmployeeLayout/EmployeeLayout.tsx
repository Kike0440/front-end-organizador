import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  House,
  ShoppingBagOpen,
  User,
  SignOut,
  List,
  X,
} from 'phosphor-react';
import styles from './EmployeeLayout.module.scss';
import Swal from 'sweetalert2';


const EmployeeLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
        title: 'Cerrar Sesión',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#A64D56',
        cancelButtonColor: '#4a6079',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        background: '#E2E0C8',
        color: '#4E635E'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('userRole');
            localStorage.removeItem('isLoggedIn');
            navigate('/');
        }
    })
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles['employee-layout']}>
      <div className={styles['employee-layout__container']}>
        <nav className={styles['employee-layout__nav']}>
          <div className={styles['employee-layout__nav-brand']}>
            <ShoppingBagOpen size={32} weight="fill" />
            <span>Mis Locales</span>
          </div>
          <button className={styles['employee-layout__menu-toggle']} onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <List size={28} />}
          </button>
          <ul className={`${styles['employee-layout__nav-links']} ${isMenuOpen ? styles['employee-layout__nav-links--open'] : ''}`}>
            <li>
              <NavLink
                to="/employee/my-locals"
                end
                className={({ isActive }) => 
                  isActive
                  ? `${styles['employee-layout__nav-link']} ${styles['employee-layout__nav-link--active']}`
                  : styles['employee-layout__nav-link']
                }
                onClick={closeMenu}
              >
                <House size={20} /> Mis Locales
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employee/profile"
                className={({ isActive }) => 
                  isActive
                  ? `${styles['employee-layout__nav-link']} ${styles['employee-layout__nav-link--active']}`
                  : styles['employee-layout__nav-link']
                }
                onClick={closeMenu}
              >
                <User size={20} /> Mi Perfil
              </NavLink>
            </li>
            <li className={styles['employee-layout__logout-mobile-item']}>
              <button onClick={handleLogout} className={styles['employee-layout__logout-mobile-button']}>
                <SignOut size={20} /> Cerrar Sesión
              </button>
            </li>
          </ul>
          <button onClick={handleLogout} className={`${styles['employee-layout__logout-button']} ${styles['employee-layout__logout-button--desktop']}`}>
            <SignOut size={20} /> Cerrar Sesión
          </button>
        </nav>
      </div>

      <main className={styles['employee-layout__content']}>
        <Outlet />
      </main>

      <footer className={styles['employee-layout__footer']}>
        <p>&copy; 2025 Renta de Locales - Empleado</p>
      </footer>
    </div>
  );
};

export default EmployeeLayout;