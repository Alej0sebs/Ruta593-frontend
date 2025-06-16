import { useState } from "react";

import {  TypeBusStationT} from "../types";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

export default function createBusStation(){
    const [loading, setLoading] = useState(false);
  
    
    const station = async(creterminal:TypeBusStationT)=>{
        setLoading(true);
        try {
            const response:Response = await fetch(`${API_BASE_URL}admins/busStation`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include',
                body:JSON.stringify(creterminal),
            });
            const data = await response.json();
            if(data.error){
                throw new Error(data.error);
            }
            
            toast.success("Terminal creada con éxito");
        } catch (error) {
            toast.error(verifyError(error));
        }finally{
            setLoading(false);
        }
    }
    return {loading, station};
}
