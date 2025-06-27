import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { initialMockLocals, initialMockUsers, initialMockContracts, initialMockExpenses } from './data/mockLocals';
import useLocalStorage from './hooks/useLocalStorage';
import type { Local, User, Contract } from './types/Local';
import type { Expense } from './types/index';

// Importacion de las paginas y componentes de admin
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminManagement from './pages/AdminManagement/AdminManagement';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import AdminExpenses from './pages/AdminExpenses/AdminExpenses';

// Importacion de las paginas y componentes de empleado
import EmployeeLocals from './pages/EmployeeLocals/EmployeeLocals';
import ContactAdminPage from './pages/ContactAdminPage/ContactAdminPage';
import ScheduleAppointmentPage from './pages/ScheduleAppointmentPage/ScheduleAppointmentPage';
import EmployeeProfile from './pages/EmployeeProfile/EmployeeProfile';

// Importacion de las paginas y componentes generales
import LocalDetailPage from './pages/LocalDetailPage/LocalDetailPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/LoginPage/LoginPage';

// Importacion de los layouts
import AdminLayout from './components/Layouts/AdminLayout/AdminLayout';
import EmployeeLayout from './components/Layouts/EmployeeLayout/EmployeeLayout';

function App() {
  const [locals, setLocals] = useLocalStorage<Local[]>('commercialLocals', initialMockLocals);
  const [users, setUsers] = useLocalStorage<User[]>('appUsers', initialMockUsers);
  const [contracts, setContracts] = useLocalStorage<Contract[]>('commercialContracts', initialMockContracts);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('commercialExpenses', initialMockExpenses);

  useEffect(() => {
    // Inicializar los datos en localStorage si están vacíos
    if (locals.length === 0) {
      setLocals(initialMockLocals);
    }
    if (users.length === 0) {
      setUsers(initialMockUsers);
    }
    if (contracts.length === 0) {
      setContracts(initialMockContracts);
    }
    if (expenses.length === 0) {
      setExpenses(initialMockExpenses);
    }
  }, [locals, users, contracts, expenses, setLocals, setUsers, setContracts, setExpenses]);

  return (
    <Routes>
      {/* Ruta para el Login - No protegida */}
      <Route path="/" element={<LoginPage />} />
      {/* Rutas Protegidas para Administrador */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/gestion-locales" element={<AdminManagement />} />
          <Route path="/admin/gestion-usuarios" element={<AdminUsers />} />
          <Route path="/admin/gestion-gastos" element={<AdminExpenses />} />
        </Route>
      </Route>
      {/* Rutas Protegidas para Empleado */}
      <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
        <Route element={<EmployeeLayout />}>
          <Route path="/employee/my-locals" element={<EmployeeLocals />} />
          <Route path="/employee/locals/:id" element={<LocalDetailPage />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/contact-admin" element={<ContactAdminPage />} />
          <Route path="/employee/schedule-appointment" element={<ScheduleAppointmentPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
