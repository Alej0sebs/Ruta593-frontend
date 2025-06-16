import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const logout = async () => {
        setLoading(true);
        try{
            const response:Response = await fetch(`${API_BASE_URL}auth/logout`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            });
            const data = await response.json();
            if(data.error){
                throw new Error(data.error);
            }
            localStorage.removeItem('chaski-log');
            setAuthUser(null);
        }catch(error){
            toast.error(verifyError(error));
        }finally{
            setLoading(false);
        }
    };

    return {loading, logout};
};