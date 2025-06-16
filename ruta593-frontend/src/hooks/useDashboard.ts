import { useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import { verifyError } from "../helpers/VerifyErrors";
import toast from "react-hot-toast";

export default function useDashboard() {

    const [loading, setLoading] = useState(false);

    const cardsDataDashboard = async () => {
        setLoading(true);
        try {
            const urlFreq = `${API_BASE_URL}dashboard/activeFreq`;
            const urlPayments = `${API_BASE_URL}dashboard/soldTickets`;
            const urlSales = `${API_BASE_URL}dashboard/totalSales`;
            const urlClients = `${API_BASE_URL}dashboard/numberClients`;

            const configHttp:RequestInit = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }

            const [activeFreqResponseResponse, quantityPaymentsResponse, salesResponse, quantityClientsResponse] = await Promise.all([fetch(urlFreq, configHttp), fetch(urlPayments, configHttp), fetch(urlSales, configHttp), fetch(urlClients, configHttp)]);
            const [dataActiveFreq, dataQuantityPayments, dataSales, dataQuantityClients] = await Promise.all([activeFreqResponseResponse.json(), quantityPaymentsResponse.json(), salesResponse.json(), quantityClientsResponse.json()]);
            if (dataActiveFreq.error || dataQuantityPayments.error || dataSales.error || dataQuantityClients.error) {
                throw new Error(dataActiveFreq.error || dataQuantityPayments.error || dataSales.error || dataQuantityClients.error);
            }
            return { dataActiveFreq:dataActiveFreq.quantity, dataQuantityPayments:dataQuantityPayments.quantity, dataSales:dataSales.sales, dataQuantityClients:dataQuantityClients.quantity };
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    };

    return { cardsDataDashboard, loading };
}