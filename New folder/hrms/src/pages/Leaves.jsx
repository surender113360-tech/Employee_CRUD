import { useEffect,useState } from "react";
import {Check,X} from 'lucide-react';
import api from "../service/api";
import PageHeader from "../components/PageHeader";
import Status from "../components/Status";



export default function Leaves(){
  const[rows,setRows]=useState([]);
  const[error,setError] =useState('');

  async function load(){
    try{
      const{data} = await api.get('/api/hr/leaves');
    setRows(Array.isArray(data)?data:[]);
    setError('');
console.log(data)
    }
     catch(e){
    setError(e.response?.data?.detail||'could not load leave request')
  }

    
  }
 useEffect(()=>{
  load()
 },[])
 async function  decide(id,decision){
  try{
    await api.patch(`/api/hr/leaves/${id}/${decision}`);
    load()
  }
  catch(e){
    setError(e.response?.data?.detail||'could not load leave request')
  }
 }
 return(
   <>
      <PageHeader title="Leave Requests" sub="Review Employee Leave Application" />
      {error && <div className="alert-error">{error}</div>}
      <div className="panel-table-warp">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.employee_name || r.full_name || r.employee_id}</td>
                <td>{r.leave_type}</td>
                <td>{String(r.start_date || '').slice(0, 10)} - {String(r.end_date || '').slice(0, 10)}</td>
                <td>{r.reason || "-"}</td>
                <td><Status value={r.status} /></td>
                <td>
                  {String(r.status || '').toLowerCase() === 'pending' ? (
                    <>
                      <button
                        className="icon-btn-success-text"
                        title="Approve"
                        onClick={() => decide(r.id, 'approve')}
                      >
                        <Check size={17} /> Approve
                      </button>

                      <button
                        className="icon-btn-danger-text"
                        title="Reject"
                        onClick={() => decide(r.id, 'rejected')}
                      >
                        <X size={17} /> Reject
                      </button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="6" className="empty">No Leave Request Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
 )

}
