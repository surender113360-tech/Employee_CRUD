import  {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

function ProtectedRoute({children,allowRole}){
    const {isAuthenticated,role} = useAuth();
    if(!isAuthenticated)
        return <Navigate to="/"replace></Navigate>;
    if(allowRole&&role !== allowRole)
        return <Navigate to="/"replace></Navigate>;

    return children;

}

export default ProtectedRoute;