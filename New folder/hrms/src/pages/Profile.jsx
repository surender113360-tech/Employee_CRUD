import { useEffect,useState } from "react"
import api from "../service/api";
import PageHeader from "../components/PageHeader";

export default function Profile(){
  const[profile,setProfile] = useState(null);
  const[error,setError]=useState('');


  useEffect(()=>{
    api.get('/api/employee/profile')
    .then(res=>setProfile(res.data))
    .catch(e=>setError(e.response?.data?.detail||'could not load profile'))
  },[])

  return(
     <>
     <PageHeader title="My profile" subtitle="Your employee information."/>
     {error&&
     <div className="alert error">
      {error}
      </div>}
    {
    profile&&
    <div className="panel profile-card">
      <div className="avatar">
        {(profile.full_name||'E').slice(0,1).toUpperCase()}
        </div>
        <h2>
          {profile.full_name}
          </h2>
          <p className="muted">{profile.employee_code}</p>
          <div className="profile-grid">
            {
            [
              ['Email',profile.email||profile.emai],
              ['Phone',profile.phone],
              ['Designation',profile.desigination||profile.designation],
              ['Department',profile.department_name],
              ['Joining date',profile.joining_date],
              ['Salary',profile.salary!=null?`n${Number(profile.salary).toLocaleString('en-IN')}`:'—']
            ].map(([k,v])=><div key={k}>
              <small className="muted">{k}</small>
              <b>{v||'—'}</b>
              </div>
            )
            }
            </div>
            </div>
            }
  </>
  )
}