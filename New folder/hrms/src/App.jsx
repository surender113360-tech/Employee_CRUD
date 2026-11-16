import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import HrDash from './pages/HrDash';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Profile from './pages/Profile';
import EmployeeLeaves from './pages/EmployeesLeaves';

function ProtectedLayout({ role }) {
  return (
    <ProtectedRoute role={role}>
      <AppLayout />
    </ProtectedRoute>
  );
}

export default function App() {
  const { user } = useAuth();

  const defaultRedirect = user
    ? user.role === 'hr'
      ? '/hr/dashboard'
      : '/employee/dashboard'
    : '/login';

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to={defaultRedirect} replace /> : <Login />}
      />

      {/* HR Routes */}
      <Route element={<ProtectedLayout role="hr" />}>
        <Route path="/hr/dashboard" element={<HrDash />} />
        <Route path="/hr/employees" element={<Employees />} />
        <Route path="/hr/departments" element={<Departments />} />
        <Route path="/hr/leaves" element={<Leaves />} />
        <Route path="/hr/payroll" element={<Payroll mode="hr" />} />
        <Route path="/hr/attendance" element={<Attendance mode="hr" />} />
        <Route path="/hr/announcements" element={<Announcements mode="hr" />} />
      </Route>

      {/* Employee Routes */}
      <Route element={<ProtectedLayout role="employee" />}>
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/profile" element={<Profile />} />
        <Route path="/employee/leaves" element={<EmployeeLeaves />} />
        <Route path="/employee/attendance" element={<Attendance mode="employee" />} />
        <Route path="/employee/payroll" element={<Payroll mode="employee" />} />
        <Route path="/employee/announcements" element={<Announcements mode="employee" />} />
      </Route>

      {/* Fallback / Root Redirect */}
      <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
    </Routes>
  );
}
