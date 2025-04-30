import { signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useContext, useState } from "react";
import { auth } from '../firebase/firebaseConfig';
import { toast } from 'react-toastify';

const AdminContext = createContext();




export const AdminProvider = ({children})=>{

   const [admin, setAdmin] = useState('');


   const AdminLogin = async (email,password) =>{
    try{
       const adminLogged = await signInWithEmailAndPassword(auth, email, password);
        toast.success('Sign in Successful');
       setAdmin(adminLogged);
    }catch(err){
      console.error("Login Error",err);
      toast.error(err.message);
    }
   }

    return (
        <AdminContext.Provider value={{admin,setAdmin,AdminLogin}} >
          {children}
        </AdminContext.Provider>
    )
}


export const useAdminContext = () => useContext(AdminContext)