import { useEffect, useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { SeatType } from "../types";



export default function useTypeSeats() {

    const [loading, setLoading] = useState(false);
    const [selectSeatTypes, setSelectSeatTypes] = useState<SeatType[]>([]);
    const [refreshKey, setRefreshKey] = useState(0); // Estado adicional para controlar la recarga


    const getSeatTypes = async()=>{
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}typeSeats`, {
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
            const formattedData= data.json.map((seat:SeatType)=>({
                id:seat.id,
                name:seat.name,
                special_caracter:seat.special_caracter,
                description:seat.description,
                additional_cost:seat.additional_cost
            }));
            
            return formattedData;
        } catch (error) {
            toast.error(verifyError(error));
        }finally{
            setLoading(false);
        }
    };

    const createSeatType = async (data:SeatType)=>{
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}typeSeats/createType`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error);
            }
            toast.success(responseData.msg);
        } catch (error) {
            toast.error(verifyError(error));
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        getSeatTypes().then((data)=>{
            setSelectSeatTypes(data);
        })
    }, [refreshKey]) //registrar el cambio de estado cuando cambie seatTypes 

    return{
        selectSeatTypes,
        loading,
        createSeatType,
        reloadSeatTypes: () => setRefreshKey((prev) => prev + 1),
    }

}