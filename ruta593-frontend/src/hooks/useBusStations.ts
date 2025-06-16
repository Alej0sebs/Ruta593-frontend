import { useEffect, useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import { verifyError } from "../helpers/VerifyErrors";
import toast from "react-hot-toast";
import { BusStationT } from "../types";

export default function useBusStations() {
    const [loading, setLoading] = useState(false);
    const [dataListBusStations, setDataListBusStations] = useState<BusStationT[]>([]);
    const [allBusStations, setAllBusStations] = useState<BusStationT[]>([]);

    // Método para obtener estaciones linkeadas al usuario
    const getBusStations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}linkedStations/allLinkedCooperatives/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            return data.json.stations;
        } catch (error) {
            toast.error(verifyError(error));
            return [];  // Retorna una lista vacía en caso de error
        } finally {
            setLoading(false);
        }
    };

    const getAllBusStations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}ubi/busStations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            const data = await response.json();
    
            // Verifica si la respuesta tiene la propiedad json
            if (!response.ok || !data.json) {
                throw new Error(data.error || "Error en la estructura de la respuesta.");
            }
    
            // Mapea la lista dentro de data.json
            const formattedData = data.json.map((station: BusStationT) => ({
                id: station.id,
                name: station.name,
                city_bus_station: {
                    id: station.city_bus_station.id,
                    name: station.city_bus_station.name,
                },
            }));
    
            return formattedData;
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };
    

    // useEffect para cargar ambas estaciones (linkeadas y todas)
    useEffect(() => {
        const fetchData = async () => {
            const linkedStations = await getBusStations();
            const allStations = await getAllBusStations();
            setDataListBusStations(linkedStations);
            setAllBusStations(allStations);
        };

        fetchData();
    }, []);  // Solo se ejecuta una vez al montar el componente

    return {
        dataListBusStations,
        allBusStations,
        loading,
        getBusStations,
        getAllBusStations,
    };
}
