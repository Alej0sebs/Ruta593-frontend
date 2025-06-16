import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { CreateUserT} from "../types";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

export default function createUser(){
    const [loading, setLoading] = useState(false);

    const signUp = async(userData:CreateUserT)=>{
        setLoading(true);
        try {
            const response:Response = await fetch(`${API_BASE_URL}users/signUp`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include',
                body:JSON.stringify(userData),
            });
            const data = await response.json();
            if(data.error){
                throw new Error(data.error);
            }
            toast.success(data.msg);
            return;
        } catch (error) {
            toast.error(verifyError(error));
        }finally{
            setLoading(false);
        }
    }

    return {loading, signUp};
}
