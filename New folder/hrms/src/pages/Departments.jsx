import React ,{useState,useEffect} from 'react';
import {Plus,Pencil,Trash2} from 'lucide-react';
import api from '../service/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';




export default function  Departments(){
  const [rows,setRows] = useState([]);
  const[name,setName]=useState('');
  const[open,setOpen]=useState(false);
  const[error,setError]= useState('');

  async function load(){
    try{
      const {data} = await api.get('/api/hr/departments');
      setRows(Array.isArray(data)?data:data.items||[])
    }
    catch(e){
      setError(e.response?.data?.detail||'could not add department')
    }
  }
  useEffect(()=>{
    load()
  },[])

  async function add(e){
    e.preventDefault();
    setError('');
    try{
      await api.post('/api/hr/departments',{name});
      setName('');
      setOpen(false);
      load()

    }
    catch(e){
      setError(e.response?.data?.details||'could not able to add a department')
    }
  }

  function unavailable(action){
    setError(`${action} is shown in the UI,but the current backend has no departments ${action.toLowerCase()} endpoint yet add the api before using the action`)
  }
  return(
    <>
    <PageHeader title="Departments" subtitle="View and add company departments."
     action={
     <button className="btn primary"
      onClick={()=>{setName('');setOpen(true);

      }
      }>
        <Plus size={16}/> Add department</button>}/>
    {error&&<div className="alert error">
      {error}
      </div>
      }
      <div className="department-grid">{
      rows.map(d=><div className="panel department-card" 
        key={d.id}>
          <div className="dept-icon">n</div>
          <div>
            <h3>{d.name}</h3>
            <small className="muted">Department ID: {d.id}</small>
            </div>
            <div className="dept-actions">
              <button className="icon-btn" title="Edit department (API required)"
               onClick={
                ()=>unavailable('Update')
                }>
                  <Pencil size={16}/>
                  </button>
                  <button className="icon-btn danger-text" title="Delete department (API required)"
                   onClick={()=>unavailable('Delete')

                   }>
                    <Trash2 size={16}/>
                    </button>
                    </div>
                    </div>
                  )}
                  </div>
    {!rows.length&&!error&&
    <div className="panel empty">No departments created yet.</div>
    }
     {
     open&&<Modal title="Add department" onClose={()=>setOpen(false)}>
      <form onSubmit={add}>
        <label className="field">
          <span>Department name</span>
          <input value={name} onChange={e=>setName(e.target.value)} required/>
          </label>
          {
          error&&
          <div className="alert error">
            {error}
            </div>
            }
            <div className="form-actions">
              <button type="button" className="btn secondary" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn primary">Create department</button>
              </div>
              </form>
              </Modal>
              }
    
    
    
    
    
    
    
    
    </>
  )


}