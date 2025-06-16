import { useState } from "react";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { API_BASE_URL } from "../helpers/Constants";
import { cooperativeT } from "../types";

export default function useCooperatives() {
    const [loading, setLoading] = useState(false);

    const getCooperativeByID = async (id: string) => {
        setLoading(true);
        try{
            const response:Response = await fetch(`${API_BASE_URL}cooperatives/${id}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include',
            });
            const data = await response.json();
            if(data.error || response.status !== 200){
                throw new Error(data.error);
            }
            return data.cooperative;
        }catch(error){
            toast.error(verifyError(error));
            return [];
        }finally{
            setLoading(false);
        }
    };

    const updateCooperative = async (cooperativeData:cooperativeT, imageFile?:File) => {
        setLoading(true);
        try{
            const formData =  new FormData();
            if(imageFile){
                formData.append('logo', imageFile);
            };
            //Agregar los demas campos de cooperativeData a FormData
            Object.entries(cooperativeData).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            const response:Response = await fetch(`${API_BASE_URL}cooperatives/updateCooperative`,{
                method:'PUT',
                credentials:'include',
                body:formData,
            });
            const data = await response.json();
            if(data.error || response.status !== 200){
                throw new Error(data.error);
            };
            toast.success(data.msg);
        }catch(error){
            toast.error(verifyError(error));
        }finally{
            setLoading(false);
        }

    };

    return{
        loading,
        getCooperativeByID,
        updateCooperative
    }
}