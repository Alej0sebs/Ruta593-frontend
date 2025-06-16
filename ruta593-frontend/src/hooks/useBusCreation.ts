import { useState } from "react";
import { TypeBusT } from "../types";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

export default function useBusCreation() {
    const [loading, setLoading] = useState(false);


    const bus = async (creBus: TypeBusT, imageFile: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('busImage', imageFile);
            // Agregar los demás campos de creBus a FormData
            Object.entries(creBus).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
            const response: Response = await fetch(`${API_BASE_URL}buses/newBus`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            };
            toast.success(data.msg);
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    const getBuses = async () => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}buses`, {
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
            return data.json;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };


    return { loading, bus, getBuses };
}
