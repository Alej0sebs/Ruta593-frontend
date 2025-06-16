import { useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import { SeatsStructureT } from "../types";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

export default function useSeatStructure() {
    const [loading, setLoading] = useState(false);

    const getSeatStructure = async (dataStructure:SeatsStructureT) => {
        setLoading(true);
        try {
            const response:Response = await fetch(`${API_BASE_URL}tickets/seats`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include',
                body:JSON.stringify(dataStructure),
            });
            const data = await response.json();
            if(data.error){
                throw new Error(data.error);
            }
            return data.json;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    }

    return {loading, getSeatStructure};
}