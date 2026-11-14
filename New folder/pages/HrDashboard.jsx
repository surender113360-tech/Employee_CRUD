import { useEffect,useState } from "react";
import api from "../api";
import PageTitle from '../components/PageTitle'

function HrDashboard(){
    const[stats,setStats] = useState(null);
    const [error,setError] = useState('');
    useEffect(()=>{
        api.get('/hr/dashboard')
        .then((response)=>setStats(response.data))
        .catch(()=>setError('could not load dashboard.check the backend is ruuning.'));

    },[])
    return(
        <> 
        <PageTitle title="HR Overview" sub="Company activity at a glance"/>
        {error && <p className="error">{error}</p>}
        {!setStats ?<p>Loading Dashboard...</p>:(

            <div className="stats-grid">
                <article className="stat-card">
                    <span>Total employees</span>
                    <strong>{stats.employee ??0}</strong>
                </article>


                  <article className="stat-card">
                    <span>Departments</span>
                    <strong>{stats.departments ??0}</strong>
                </article>


                  <article className="stat-card">
                    <span>Pending Leaves</span>
                    <strong>{stats.pennding_leaves ??0}</strong>
                </article>


                  <article className="stat-card">
                    <span>Present today</span>
                    <strong>{stats.today_attendance ??0}</strong>
                </article>
            </div>
        )}
        </>
    )




}
export default HrDashboard