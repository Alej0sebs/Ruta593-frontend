import { useEffect, useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { CityBusStationT } from "../types";

export const useCity = () => {
    const [loading, setLoading] = useState(false);
    const [selectCity, setSelectCity] = useState<CityBusStationT[]>([]); // Cambiar a array

    const getCity = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}ubi?page=1&&limit=200`, {
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
        getCity().then((data) => {
            setSelectCity(data); // Asigna la lista al estado selectCity
        });
    }, []);

    return { loading, selectCity };
};