import React from 'react';
import { useEffect,useState } from 'react';
import { Plus, Search, Pencil, UserX } from 'lucide-react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const Employees = () => {
  const blank = {employee_code:'',full_name:'',email:'',phone:'',desigination:'',department_id:'',joining_date:'',salary:''}

   function Employees(){
    const[rows,setRows] = useState([]);
    const[departments,setDepartments] = useState([]);
    const[query,setQuery] = useState('');
    const[open,setOpen] = useState(false);
    const[editing,setEditing] = useState(null);
    const[form,setForm]=useState(blank);
    const[error,setError]=useState('');
    const[busy,setBusy]=useState(false);

    async function load(){
      try{
        const [e,d] = await Promises.all([api.get('/api/hr/employees'),api.get('/api/hr/departments')]);
        setRows(Array.isArray(e.data)?e.data:e.data.items||[]);
        setDepartments(Array.isArray(d.data)?d.data:d.data.items||[]);
      }
      catch(error){
        setError(error.response?.data.detail||'unable to load employee')
      }
    }

    useEffect(()=>{
      load()

    },[])
    function startAdd(){
      setEditing(null);
      setForm(blank);
      setError('');
      setOpen(true);
    }

     function startEdit(row){
      setEditing(row);
      setForm({...blank,...row,department_id:row.department_id??'',joining_date:row.joining_date?.slice(0,10)||''});
      setError('');
      setOpen(true);
    }
     async function save(e){
      e.preventDefault();
      setBusy(true);
      setError('');
      const payload={...form,department_id:form.department_id?Number(form.department_id):null,salary:Number(form.salary||0)

      };
      try{
        if(editing) await api.put(`/api/hr/employees/${editing.id}`,payload);
        else await api.post('/api/hr/employees',payload);
        setOpen(false);
        await load();
      }
      catch(err)
      {setError(err.response?.data?.detail||'Could not save employee');

      }
      finally{
setBusy(false);}}


  }
  return (
    <div>Employees</div>
  )
}

export default Employees