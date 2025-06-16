import { useState } from "react";
import { TicketsListT } from "../types";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

export default function useSerialStation() {
    const [loading, setLoading] = useState(false);
    const createSerialStation = async (SerialStationData: TicketsListT) => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}serialNumbers/serial`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(SerialStationData),
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            // toast.success(data.msg);
            return;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    const getSerialStation = async (page:number) => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}serialNumbers?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }

            const data = await response.json();

            if (!data?.json || !data.json.list) {
                throw new Error('Los datos no contienen la propiedad "json.list"');
            }

            return data.json;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    const getSerialStationByStationAndDNI = async () => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}serialNumbers/serialSeller`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            return data.json;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };


    return { loading, createSerialStation, getSerialStation, getSerialStationByStationAndDNI };
}