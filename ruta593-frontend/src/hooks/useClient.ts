import { useState } from "react"
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { API_BASE_URL } from "../helpers/Constants";

export const useClient = () => {
    const [loading, setLoading] = useState(false);
    const getClientByDNI = async (dni: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}clients/dni/${dni}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error)
            }
            return data
        } catch (error) {
            toast.error(verifyError(error))
            return;
        } finally {
            setLoading(false);
        }
    }

    return { getClientByDNI, loading }
}