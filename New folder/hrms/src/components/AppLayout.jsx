import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Wallet,
  Clock3,
  Megaphone,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const hrLinks = [
  ['/hr/dashboard', 'Dashboard', LayoutDashboard],
  ['/hr/employees', 'Employees', Users],
  ['/hr/departments', 'Departments', Building2],
  ['/hr/leaves', 'Leave requests', ClipboardList],
  ['/hr/payroll', 'Payroll', Wallet],
  ['/hr/attendance', 'Attendance', Clock3],
  ['/hr/announcements', 'Announcements', Megaphone],
];

const employeeLinks = [
  ['/employee/dashboard', 'Dashboard', LayoutDashboard],
  ['/employee/profile', 'My Profile', UserCircle],
  ['/employee/attendance', 'Attendance', Clock3],
  ['/employee/leaves', 'My Leaves', ClipboardList],
  ['/employee/payroll', 'Payroll', Wallet],
  ['/employee/announcements', 'Announcements', Megaphone],
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'hr' ? hrLinks : employeeLinks;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          EMS<span>.</span>
          <small>People Management</small>
        </div>
        <div className="side-label">
          {user?.role === 'hr' ? 'HR WORKSPACE' : 'EMPLOYEE WORKSPACE'}
        </div>
        <nav>
          {links.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === '/hr' || to === '/employee'}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          className="logout"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          ■ Sign out
        </button>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <span>Company Management System</span>
          <span className="user-chip">{user?.role?.toUpperCase()}</span>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
