import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock3, Wallet, Megaphone } from 'lucide-react';
import api from '../service/api';
import PageHeader from '../components/PageHeader';


export default function EmployeeDashboard(){
    const [profile,setProfile] = useState(null);
    const[leaves,setLeaves]=useState([]);
    const[error,setError]=useState('');
    useEffect(()=>

        {Promise.all([api.get('/api/employee/profile'),api.get('/api/employee/leaves')])
        .then(([p,l])=>{setProfile(p.data);
            setLeaves(Array.isArray(l.data)?l.data:l.data.items||[])})
        .catch(e=>setError(e.response?.data?.detail||'some dashboard information could not be loaded'))
    },[])
    const pending = leaves.filter(x=>String(x.status).toLowerCase() ==='pending').length;
    return(
         <>
         <PageHeader title="My dashboard"
          subtitle={`Welcome${profile?.full_name?' back, '+profile.full_name:''}. Here's your workspace.`}/>
          {
          error&&
          <div className="alert error">{error}</div>
          }
    <div className="stat-grid">
        <div className="stat-card">
            <div className="stat-icon">
                <CalendarDays/>
                </div>
                <p>My leave requests</p>
                <strong>{leaves.length}</strong>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <Clock3/>
                        </div>
                        <p>Pending requests</p>
                        <strong>{pending}</strong>
                        </div>
                        </div>
    <div className="quick-card-grid">
        <Link className="panel quick-card" to="/employee/attendance">
        <Clock3/>
        <h3>Attendance</h3>
        <p>Clock in/out and view attendance.</p>
        </Link>
        <Link className="panel quick-card" to="/employee/leaves">
        <CalendarDays/>
        <h3>Apply leave</h3>
        <p>Submit and track leave requests.</p>
        </Link>
        <Link className="panel quick-card" to="/employee/payroll">
        <Wallet/>
        <h3>Payroll</h3>
        <p>View your salary records.</p>
        </Link>
        <Link className="panel quick-card" to="/employee/announcements">
        <Megaphone/>
        <h3>Announcements</h3>
        <p>Read company updates.</p>
        </Link>
        </div>
  </>
    )
}
