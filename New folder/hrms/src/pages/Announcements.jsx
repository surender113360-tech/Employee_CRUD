import { useEffect, useState } from 'react';
import { Plus, Megaphone } from 'lucide-react';
import api from '../service/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

export default function Announcements({mode = 'hr'}){
  const isHR = mode === 'hr';
  const[rows,setRows]=useState([]);
  const [open,setOpen]=useState(false);
  const[form,setForm]=useState({title:'',message:''});
  const[error,setError]=useState('');
  async function load(){
    try{
      const{data}=await api.get(isHR?'/api/hr/announcement':'api/employee/announcement');
      setRows(Array.isArray(data)?data:data.items||[])
    }
    catch(e){
      setError(e.response?.data?.detail||"could not load the announcement")
    }
  }
  useEffect(()=>{
    load()
  },[isHR])

  async function create(e){
    e.preventDefault();
    try{
      await api.post('/api/hr/announcement',form);
      setOpen(false);
      setForm({title:'',message:""});
      load();
    }
    catch(e){
      setError(e.response?.data?.detail||'could not publish announcements');
    }
    
  }
  return(
     <>
     <PageHeader title="Announcements"
      sub={isHR?'Share company updates with employees.':'Latest company updates and notices.'}
       action={
        isHR&&
        <button className="btn primary" 
        onClick={
          ()=>setOpen(true)}>
            <Plus size={16}/> 
            New announcement
            </button>
          }
          />
    {
    error&&
    <div className="alert error">{error}</div>}
    <div className="announcement-grid">
      {rows.map(r=>
      <article className="panel announcement" key={r.id}>
        <div className="announce-icon">
          <Megaphone/>
          </div>
          <div>
            <h3>
              {r.title}
              </h3>
              <p>
                {r.message}
                </p>
                <small className="muted">
                  {r.created_at?new Date(r.created_at).toLocaleString():'Company announcement'}</small>
                  </div>
                  </article>
                )
                }
                </div>
    {
    !rows.length&&
    <div className="panel empty">No announcements available.</div>}
    {
    open&&
    <div title="Create announcement" 
    onClose={()=>setOpen(false)}>
      <form onSubmit={create}>
        <label className="field">
          <span>Title</span>
          <input value={form.title}
           onChange={e=>setForm({...form,title:e.target.value})} required/>
           </label>
           <label className="field"><span>Message</span><textarea rows="5" value={form.message} 
           onChange={e=>setForm({...form,message:e.target.value})} required/>
           </label>
           <div className="form-actions">
            <button type="button" className="btn secondary"
             onClick={()=>setOpen(false)}>Cancel</button>
             <button className="btn primary">Publish</button>
             </div>
             </form>
             </div>}
  </>
  )

}