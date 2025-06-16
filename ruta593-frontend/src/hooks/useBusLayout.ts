import { useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import { LayoutBusT } from "../types";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

export default function useBusLayout(){
    const [loading, setLoading] = useState(false);

    const sendBusLayout = async (layoutBus:LayoutBusT) => {
        setLoading(true);
        try{
            const res:Response= await fetch(`${API_BASE_URL}busStructure/layout`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(layoutBus),
            });
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.error);
            }
            toast.success(data.msg);
        }catch(error){
            toast.error(verifyError(error));
        }finally{
            setLoading(false);
        }
    };

    // const getBusLayout = async (cooperative_id:string) => {

    // };


    return {
        loading,
        sendBusLayout,
    };
}