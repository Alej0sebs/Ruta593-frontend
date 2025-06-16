import { useEffect, useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { UserT } from "../types";

export const useSeller = () => {
    const [loading, setLoading] = useState(false);
    const [selectSeller, setSelectSeller] = useState<UserT[]>([]); // Cambiar a array

    const getSellers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            // Devuelve solo la lista de ciudades
            return data.json.list;
        } catch (error) {
            toast.error(verifyError(error));
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSellers
            ().then((data) => {
                setSelectSeller(data); // Asigna la lista al estado selectSeller

            });
    }, []);

    return {
        loading, selectSeller
    };
};
