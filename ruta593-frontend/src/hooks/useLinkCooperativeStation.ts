import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

export default function useLinkCooperativeStation() {
    const [loading, setLoading] = useState(false);
    const { authUser } = useAuthContext(); // Obtener el usuario autenticado para usar su token o datos

    const linkStation = async (stationId: number) => {
        setLoading(true);
        try {
            if (!authUser) {
                throw new Error("Usuario no autenticado.");
            }

            // Realizamos una solicitud GET para enlazar la estación, pasando el ID en la URL
            const response: Response = await fetch(`${API_BASE_URL}linkedStations/linkCooperative/${stationId}`, {
                method: "GET", // Usamos el método GET
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`${data?.msg || "Error al asociar la estación "}`);
            }

            toast.success("Estación asociada correctamente.");
            return data;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    // Método para obtener todas las estaciones vinculadas
    const getLinkedStations = async (page: number) => {
        setLoading(true);
        try {
            if (!authUser) {
                throw new Error("Usuario no autenticado.");
            }

            const response: Response = await fetch(`${API_BASE_URL}linkedStations?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(`${data?.msg || "Error al obtener las estaciones vinculadas"}`);
            }
            return data.json;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    const getAllLinkedStations = async () => {
        setLoading(true);
        try {
            if (!authUser) {
                throw new Error("Usuario no autenticado.");
            }

            const response: Response = await fetch(`${API_BASE_URL}linkedStations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(`${data?.msg || "Error al obtener las estaciones vinculadas"}`);
            }
            return data.json;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    return { loading, linkStation, getLinkedStations, getAllLinkedStations};
}
