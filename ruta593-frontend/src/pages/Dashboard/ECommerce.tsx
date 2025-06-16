import { useEffect, useState } from 'react';
import { FaBusAlt, FaUsers } from 'react-icons/fa';
import { MdOutlinePayments } from 'react-icons/md';
import { FcSalesPerformance } from 'react-icons/fc';
import Ruta593Logo from '../../images/Ruta593-logo/mountain.png';
import useDashboard from '../../hooks/useDashboard';
import { useAuthContext } from '../../context/AuthContext';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

const Dashboard = () => {
    const { cardsDataDashboard } = useDashboard();
    const [activeFreq, setActiveFreq] = useState<number>(0);
    const [quantityPayments, setQuantityPayments] = useState<number>(0);
    const [sales, setSales] = useState<number>(0);
    const [quantityClients, setQuantityClients] = useState<number>(0);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (!authUser) return;
        const fetchData = async () => {
            try {
                const data = await cardsDataDashboard();
                if (data) {
                    const { dataActiveFreq, dataQuantityPayments, dataSales, dataQuantityClients } = data;
                    setActiveFreq(dataActiveFreq);
                    setQuantityPayments(dataQuantityPayments);
                    setSales(dataSales);
                    setQuantityClients(dataQuantityClients);
                }
            } catch (error) {
                console.error('Error al obtener los datos del dashboard:', error);
            }
        };
        fetchData();
    }, [authUser]);

    const chartOptions: ApexOptions = {
        chart: {
            id: 'ventas-mensuales',
            toolbar: { show: false },
            foreColor: '#fff',
        },
        xaxis: {
            categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        },
        stroke: {
            curve: 'smooth',
            width: 3,
            colors: ['#FEDD00'],
        },
        grid: { borderColor: '#334155' },
        tooltip: { theme: 'dark' },
    };

    const chartSeries = [
        {
            name: 'Ventas',
            data: [1200, 1580, 1500, 1800, 2000, 2100],
        },
    ];

    const Card = ({ title, total, icon, color }: any) => (
        <div className="bg-[#1A2F4A] text-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-2xl transition">
            <div className={`text-3xl p-4 rounded-full ${color}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-300">{title}</p>
                <h2 className="text-2xl font-bold text-white">{total}</h2>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FEDD00] px-6 py-10">
            <div className="bg-[#0F1A2F] rounded-xl shadow-xl p-6">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Bienvenido, {authUser?.full_name || 'Usuario'} 👋
                </h1>

                {/* Tarjetas de métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                    <Card
                        title="Frecuencias Activas"
                        total={activeFreq.toString()}
                        icon={<FaBusAlt />}
                        color="bg-[#FEDD00] text-[#0F1A2F]"
                    />
                    <Card
                        title="Tickets Vendidos"
                        total={quantityPayments.toString()}
                        icon={<MdOutlinePayments />}
                        color="bg-green-500 text-white"
                    />
                    <Card
                        title="Total Ventas"
                        total={`$${sales}`}
                        icon={<FcSalesPerformance />}
                        color="bg-white"
                    />
                    <Card
                        title="Total Clientes"
                        total={quantityClients.toString()}
                        icon={<FaUsers />}
                        color="bg-blue-500 text-white"
                    />
                </div>

                {/* Gráfico interactivo */}
                <div className="bg-[#0F1A2F] rounded-xl p-6 shadow-lg">
                    <h2 className="text-white font-bold text-lg mb-4">Ventas Mensuales</h2>
                    <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="line"
                        height={320}
                    />
                </div>

                {/* Logo inferior */}
                <div className="mt-10 flex justify-center">
                    <img src={Ruta593Logo} alt="Logo Ruta593" className="h-40" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
