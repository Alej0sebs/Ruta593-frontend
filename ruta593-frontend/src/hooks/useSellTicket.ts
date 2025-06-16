import { useState } from "react";
import { TicketClientInformationT } from "../types";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { API_BASE_URL } from "../helpers/Constants";

export const useSellTicket = () => {
    const [loading, setLoading] = useState(false);

    const sellTicket = async (purchaseData:TicketClientInformationT) => {
        setLoading(true);

        try{
            const reponse= await fetch(`${API_BASE_URL}tickets/sell`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(purchaseData),
            });
            const data = await reponse.json();
            if(!reponse.ok){
                throw new Error(data.error);
            }
            return {
                status:200,
                message:data
            };

        }catch(error){
            toast.error(verifyError(error));
            return;
        }finally{
            setLoading(false);
        }
    };

    const sendData = async (ticketData:string) => {
        try{
            const response = await fetch(`${API_BASE_URL}tickets/sellData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: ticketData,
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error);
            }
            return {
                status:200,
                message:data
            };
        }catch(error){
            toast.error(verifyError(error));
            return;
        }
    }

    const getTicketsClientFrequency = async (frequencyID:string, page:number) => {
        //Enviar los datos de la paginacion
        try{
            const response = await fetch(`${API_BASE_URL}tickets/clients/${frequencyID}?page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error);
            }
            return {
                status:200,
                message:data
            };
        }catch(error){
            toast.error(verifyError(error));
            return;
        }finally{
            setLoading(false);
        }
    };

    const getTicketBySeat = async (frequency_id:string, seatID:string) => {
        try{
            const response = await fetch(`${API_BASE_URL}tickets/data?seat=${seatID}&frequency=${frequency_id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error);
            }
            return {
                status:200,
                message:data
            };
        }catch(error){
            toast.error(verifyError(error));
            return;
        }
    }

    return {
        loading, sellTicket, getTicketsClientFrequency, getTicketBySeat, sendData
    };

};