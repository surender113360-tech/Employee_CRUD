import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Users,LockKeyhole} from 'lucide-react';
import api from '../service/api';
import { useAuth } from '../context/AuthContext';



export default function Login(){
    const[email,setEmail] = useState('hr@gmail.com');
    const[password,setPassword] = useState('123');
    const [error,setError]=useState('');
    const[busy,setBusy]=useState(false);
    const{login}=useAuth();
    const navigate = useNavigate();


    async function submit(e){
        e.preventDefault();
        setError('');
        setBusy(true);
        

        try{
            const{data} =await api.post('/api/auth/login',{email,password});
            login(data);
              navigate(data.role === 'hr'?'/hr/dashboard':'/employee',{replace:true});
        }
        catch(error){
            setError(error.response?.data?.detail||'Login Failed Check your email and password.');
        }
        finally{
            setBusy(false);
        }
    }
    return(
        <>
         <div className='login-page'>
            <div className='login-art'>
                <div className='brand-light'>EMS
                    <span>.</span>
                </div>
                <div>
                    <p className='eyebrow'>
                        ONE WORK SPACE.EVERY PEOPLE TASK
                    </p>
                    <h1>MANAGE YOUR PEOPLE<br/>WITH CONFIDENCE</h1>
                    <p>Employees,attendance,leave,payroll and announcements in one place</p>
                </div>
                <div className='art-footer'>COMPANY MANAGEMENT SYSTEM</div>
            </div>
        </div>

        <form className='login-card' onSubmit={submit}>
            <div className='login-icon'>
                <Users size={25}/>
            </div>
            <h2>WELCOME BACK</h2>
            <p className='muted'>Sign in to continue to your work space</p>
            <label className='field'>
                <span> Email Address</span>
                <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)}required/>
            </label>

            <label className='field'>
                <span> Password</span>
                <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}required/>
            </label>
            {error && <div className='alert-error'>{error}</div>}
            <button className='btn-primary-full' disabled = {busy}>{busy? 'signing in....':"sign in"}
                <LockKeyhole size={16}/></button>
                <small className='muted'>Use the HR or EMPLOYEE account </small>

        </form>
        </>
       
    )
}



