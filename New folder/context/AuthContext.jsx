import { createContext,useContext,useMemo,useState } from "react";


const AuthContext  =  createContext(null);


export function AuthProvider({children}){
    const[token,setToken] = useState(()=>localStorage.getItem('token'));
    const [role,setRole] = useState(()=>localStorage.getItem('role'));


    function login(loginToken,loginRole){
        localStorage.setItem('token',loginToken);
        localStorage.setItem('role',loginRole);
        setToken(loginToken);
        setRole(loginRole);
    }

    function logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
    }


    const value = useMemo(
        ()=>({token,role,isAuthenticated:Boolean(token),login,logout}),
        [token,role]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}



export function useAuth(){
    const context = useContext(AuthContext);
    
    if(!context){
        throw  new Error('useAuth must be inside Authprovider')
    }
    return context;
}