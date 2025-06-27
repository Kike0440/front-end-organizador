import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    House,
    Users,
    Storefront,
    SignOut,
    List,
    Coins,
    X,
    CaretUp,
    CaretDown
} from 'phosphor-react';
import styles from './AdminLayout.module.scss';
import Swal from 'sweetalert2';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const location = useLocation();

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
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleSubmenu = (menuName: string) => {
        setOpenSubmenu(prev => (prev === menuName ? null : menuName));
    };

    useEffect(() => {
        closeMenu();
        setOpenSubmenu(null);
    }, [location.pathname]);

    return (
        <div className={styles['admin-layout']}>
            <div className={styles['admin-layout__container']}>
                <nav className={styles['admin-layout__nav']}>
                    <div className={styles['admin-layout__nav-brand']}>
                        <Storefront size={32} weight="fill" />
                        <span>Administrar Locales</span>
                    </div>
                    <button className={styles['admin-layout__menu-toggle']} onClick={toggleMenu}>
                        {isMenuOpen ? <X size={28} /> : <List size={28} />}
                    </button>
                    <ul className={`${styles['admin-layout__nav-links']} ${isMenuOpen ? styles['admin-layout__nav-links--open'] : ''}`}>
                        <li>
                            <NavLink
                                to="/admin/dashboard"
                                end
                                className={({ isActive }) => 
                                    isActive
                                    ? `${styles['admin-layout__nav-link']} ${styles['admin-layout__nav-link--active']}`
                                    : styles['admin-layout__nav-link']
                                }
                                onClick={closeMenu}
                            >
                                <House size={20} /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/gestion-locales"
                                className={({ isActive }) => 
                                    isActive
                                    ? `${styles['admin-layout__nav-link']} ${styles['admin-layout__nav-link--active']}`
                                    : styles['admin-layout__nav-link']
                                }
                                onClick={closeMenu}
                            >
                                <Storefront size={20} /> Gestión Locales
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/gestion-usuarios"
                                className={({ isActive }) => 
                                    isActive
                                    ? `${styles['admin-layout__nav-link']} ${styles['admin-layout__nav-link--active']}`
                                    : styles['admin-layout__nav-link']
                                }
                                onClick={closeMenu}
                            >
                                <Users size={20} /> Gestión Usuarios
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/gestion-gastos"
                                className={({ isActive }) => 
                                    isActive
                                    ? `${styles['admin-layout__nav-link']} ${styles['admin-layout__nav-link--active']}`
                                    : styles['admin-layout__nav-link']
                                }
                                onClick={closeMenu}
                            >
                                <Coins size={20} /> Gestión Gastos
                            </NavLink>
                        </li>
                        <li className={styles['admin-layout__has-submenu']}>
                            <button
                                className={`${styles['admin-layout__nav-link']} ${styles['admin-layout__nav-link--parent']} ${openSubmenu === 'gestion-activos' ? styles['admin-layout__nav-link--parent-active'] : ''}`}
                                onClick={() => toggleSubmenu('gestion-activos')}
                            >
                                Gestión Activos
                                {openSubmenu === 'gestion-activos' ? <CaretUp size={16} /> : <CaretDown size={16} />}
                            </button>
                            <ul className={`${styles['admin-layout__submenu']} ${openSubmenu === 'gestion-activos' ? styles['admin-layout__submenu--open'] : ''}`}>
                                <li>
                                    <NavLink
                                        to="/admin/gestion-locales"
                                        className={({ isActive }) =>
                                        isActive
                                            ? `${styles['admin-layout__nav-link']} ${styles['admin-layout__nav-link--active']}`
                                            : styles['admin-layout__nav-link']
                                        }
                                        onClick={closeMenu}
                                    >
                                        <Storefront size={20} /> Ver Locales
                                    </NavLink>
                                </li>
                                <li>
                                    {/* Esto es un placeholder para futuros contratos */}
                                    <NavLink
                                        to="/admin/gestion-contratos"
                                        className={({ isActive }) =>
                                        isActive
                                            ? `${styles['admin-layout__nav-link']} ${styles['admin-layout__nav-link--active']}`
                                            : styles['admin-layout__nav-link']
                                        }
                                        onClick={closeMenu}
                                    >
                                        Gestión de Contratos
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className={styles['admin-layout__logout-mobile-item']}>
                            <button onClick={handleLogout} className={styles['admin-layout__logout-mobile-button']}>
                                <SignOut size={20} /> Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                    <button onClick={handleLogout} className={`${styles['admin-layout__logout-button']} ${styles['admin-layout__logout-button--desktop']}`}>
                        <SignOut size={20} /> Cerrar Sesión
                    </button>
                </nav>
            </div>

            <main className={styles['admin-layout__content']}>
                <Outlet />
            </main>

            <footer className={styles['admin-layout__footer']}>
                <p>&copy; 2025 Renta de Locales - Admin</p>
            </footer>
        </div>
    )
};

export default AdminLayout;