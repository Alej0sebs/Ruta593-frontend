import { useState } from "react";
import { editFrequencyT, FrequencyT } from "../types";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

//Aqui se manejara solo la creacion de la frecuencia
export default function useFrequency() {
    const [loading, setLoading] = useState(false);
    const createFrequency = async (frequencyData: FrequencyT) => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}frequency/frequency`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(frequencyData),
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success(data.msg);
            return;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    const getFrequencies = async () => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}frequency/frequencies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data.json.listFrequencies;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    const editFrequency = async (frequencyData: editFrequencyT) => {
        setLoading(true);
        try{
            const response: Response = await fetch(`${API_BASE_URL}frequency/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(frequencyData),
            });
            const data = await response.json();
            if(data.error){
                throw new Error(data.error);
            }
            toast.success(data.json.msg);
            return;
        }catch(error){
            toast.error(verifyError(error));    
        }
    };

    const deleteFrequency= async (id: string) => {
        setLoading(true);
        try{
            const response: Response = await fetch(`${API_BASE_URL}frequency/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if(data.error){
                throw new Error(data.error);
            }
            toast.success(data.json.msg);
            return;
        }catch(error){
            toast.error(verifyError(error));    
        }
    };

    return { loading, createFrequency, getFrequencies, editFrequency, deleteFrequency};
}