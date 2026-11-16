import { createContext,useContext,useMemo,useState } from "react";


const AuthContext  =  createContext(null);


export function AuthProvider({children}){
    const[user,setUser]=useState(()=>{
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        return token && role ?{token,role}:null
    })
 


    function login(data){
        localStorage.setItem('token',data.access_token);
        localStorage.setItem('role',data.role);
        setUser({'token':data.access_token,'role':data.role});
    }

    function logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    }

    return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>


 

}



export function useAuth(){
    const context = useContext(AuthContext);
    
    if(!context){
        throw  new Error('useAuth must be inside Authprovider')
    }
    return context;
}