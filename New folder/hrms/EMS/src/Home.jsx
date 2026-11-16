import React from 'react';
import {
  FaBell,
  FaBuilding,
  FaBullhorn,
  FaCalendarDay,
  FaCalendarCheck,
  FaCircleCheck,
  FaChevronDown,
  FaChevronRight,
  FaClipboardList,
  FaDollarSign,
  FaHouse,
  FaPlus,
  FaUser,
  FaUsers,
} from 'react-icons/fa6';
import { IoMdExit } from "react-icons/io";
import { useNavigate } from 'react-router-dom';




const Home = () => {
  const navigate = useNavigate()


function view_all_nav(title){
  if (title == 'Present Today'){
    navigate('/today-present')
  }
  else if (title == "Total Announcements"){
    navigate('/announcement')
  }
else if (title == "Approved Leave"){
    navigate('/approval')
  }
  else if (title == "Pending Payroll"){
    navigate('/Pending Approvals')
  }
}


const navItems = [
  { label: 'Dashboard', icon: <FaHouse />, active: true },
  { label: 'Employees', icon: <FaUsers />, hasCaret: true },
  { label: 'Departments', icon: <FaBuilding />, hasArrow: true },
  { label: 'Leave Management', icon: <FaClipboardList />, hasArrow: true },
  { label: 'Payroll', icon: <FaDollarSign />, hasArrow: true },
  { label: 'Attendance', icon: <FaCalendarCheck />, hasArrow: true },
  { label: 'Announcements', icon: <FaBullhorn />, hasArrow: true },
]

const topStats = [
  { title: 'Total Employees', value: '2', icon: <FaUsers />, tone: 'orange' },
  { title: 'On Leave Today', value: '0', icon: <FaUser />, tone: 'purple' },
  { title: 'Total Departments', value: '6', icon: <FaBuilding />, tone: 'teal' },
  { title: 'Pending Approvals', value: '0', icon: <FaClipboardList />, tone: 'blue' },
]

const bottomStats = [
  { title: 'Present Today', value: '0', icon: <FaUser />, tone: 'green' },
  { title: 'Total Announcements', value: '1', icon: <FaBullhorn />, tone: 'yellow' },
  { title: 'Approved Leave', value: '0', icon: <FaCircleCheck />, tone: 'sky' },
  { title: 'Pending Payroll', value: '1', icon: <FaDollarSign />, tone: 'red' },
]


  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">E</div>
          <div className="brand-copy">
            <span>Employee</span>
            <span>Management</span>
            <span>System</span>
          </div>
        </div>

        <div className="nav-title">Main</div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
              <div className="nav-main">
                <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              </div>

              {item.hasCaret && <FaChevronDown className="nav-caret" />}
              {item.hasArrow && <FaChevronRight className="nav-arrow" />}
            </div>
          ))}
        </nav>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <button type="button" className="add-btn" onClick={()=>navigate('/Add-emp')}>
            <FaPlus />
            Add New Employee
          </button>

          <button type="button" className="logout-btn">
            Logout
          </button>

          <button type="button" className="icon-btn" aria-label="Notifications">
            <FaBell />
          </button>

          <div className="avatar" aria-label="Profile">
            A
          </div>
        </header>

        <section className="dashboard-panel">
          <div className="welcome-row">
            <div className="welcome-copy">
              <h1>Welcome, Admin</h1>
              <p>Here’s what’s happening with your team today.</p>
            </div>

            <div className="date-pill">
              <FaCalendarDay />
              <span>August 27, 2025</span>
            </div>
          </div>

          <div className="stats-grid stats-top">
            {topStats.map((stat) => (
              <div key={stat.title} className={`stat-card ${stat.tone}`}>
                <div className="stat-header">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-label">{stat.title}</div>
                </div>

                <div className="stat-value">{stat.value}</div>

                <button type="button" className="stat-link">
                  View List
                </button>
              </div>
            ))}
          </div>

          <div className="stats-grid stats-bottom">
            {bottomStats.map((stat) => (
              <div key={stat.title} className={`mini-card ${stat.tone}`}>
                <div className="mini-top">
                  <div><h4>{stat.title}</h4></div>
                  
                  <div className="mini-icon">{stat.icon}</div>
                  <div className="mini-value">{stat.value}</div>
                </div>

                <button type="button" className="mini-link" onClick={()=>view_all_nav(stat.title)}>
                  View 
                </button>
              </div>
            ))}
          </div>
          {/* <button>view employee</button> */}
        </section>
      </main>
    </div>
  )
}

export default Home
