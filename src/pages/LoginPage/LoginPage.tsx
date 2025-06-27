import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';
import { initialMockUsers } from '../../data/mockLocals';
import Swal from 'sweetalert2'
import { ADMIN_CREDENTIALS, EMPLOYEE_CREDENTIALS } from '../../constants/mockUsers';
import { EyeClosed, Eye   } from 'phosphor-react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('isLoggedIn', 'true');
            Swal.fire({
                title: '¡Inicio de sesión exitoso como administrador!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
                background: '#E2E0C8',
                color: '#4E635E'
            }).then(() => {
                localStorage.setItem('currentUser', JSON.stringify(initialMockUsers[0]));
                navigate('/admin/dashboard');
            })
        } else if (username === EMPLOYEE_CREDENTIALS.username && password === EMPLOYEE_CREDENTIALS.password) {
            localStorage.setItem('userRole', 'employee');
            localStorage.setItem('isLoggedIn', 'true');
            Swal.fire({
                title: '¡Inicio de sesión exitoso como empleado!',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
                background: '#E2E0C8',
                color: '#4E635E'
            }).then(() => {
                localStorage.setItem('currentUser', JSON.stringify(initialMockUsers[1]));
                navigate('/employee/my-locals');
            })
        } else {
            Swal.fire({
                title: 'Credenciales incorrectas',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
                background: '#E2E0C8',
                color: '#4E635E'
            }).then(() => {
                localStorage.removeItem('userRole');
                localStorage.removeItem('isLoggedIn');
            })
        }
    }


    return (
        <div className={styles['login-page']}>
            <div className={styles['login-form']}>
                <h2 className={styles['login-form__title']}>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className={styles['login-form__group']}>
                        <label htmlFor="username" className={styles['login-form__label']}>
                            Usuario
                        </label>
                        <input
                            type="text"
                            id='username'
                            className={styles['login-form__input']}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles['login-form__group']}>
                        <label htmlFor="password" className={styles['login-form__label']}>
                            Contraseña
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            className={styles['login-form__input']}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {showPassword ? 
                        <Eye size={24} className={styles['login-form__icon']} onClick={() => setShowPassword(!showPassword)} />
                        : <EyeClosed size={24} className={styles['login-form__icon']} onClick={() => setShowPassword(!showPassword)} />}
                    </div>
                    <button type='submit' className={styles['login-form__button']}>
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;