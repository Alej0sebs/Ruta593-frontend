import { MdOutlinePriceChange } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import PaginationDataTable from "../../components/Tables/PaginationDataTable";
import Switcher from "../../components/Switchers/switcher.components";
import { useEffect, useState } from "react";
import useRoutes from "../../hooks/useRoutes";
import useBusCreation from "../../hooks/useBusCreation";
import useUsers from "../../hooks/useUsers";
import { FrequencyT, timeDatePriceT } from "../../types";
import toast from "react-hot-toast";
import useFrequency from "../../hooks/useFrequency";

// DATOS DE PRUEBA RENDERIZADO
const titles = [
    // 'id', // Eliminado el identificador
    'departure_station_name',
    'departure_city_name',
    'arrival_station_name',
    'arrival_city_name',
    'time'
];
const expandTitles: string[] = []; // Eliminado el despliegue/expansión
const displayHeader = [
    // 'Identificador', // Eliminado el identificador
    'Estación de salida',
    'Ciudad de salida',
    'Estación de llegada',
    'Ciudad de llegada',
    'Horario'
];

//Estado inicial Datos
const initialStateTimeDate: timeDatePriceT = {
    date: '',
    departure_time: '',
    arrival_time: '',
    routeID: '',
    price: '0',
}

// DATOS DE PRUEBA RENDERIZADO
const FrequencyRegistration = () => {
    const [frequencyStatus, setFrequencyStatus] = useState(false);
    //PaginationDataTable data
    const { loading, getRoutes } = useRoutes();
    //Listado de las rutas
    const [listRoutes, setListRoutes] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    //state of inputs
    const [selectedBus, setSelectedBus] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');
    const [fillDataTable, setFillDataTable] = useState<timeDatePriceT>(initialStateTimeDate);
    const today = new Date().toISOString().split('T')[0]; //get today's date in the format YYYY-MM-DD
    //hook
    const { getBuses } = useBusCreation();
    const { getDrivers } = useUsers();
    const { createFrequency } = useFrequency();
    //render data
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const fetchBuses = async () => {
        const busData = await getBuses();
        if (busData) setBuses(busData);
        const driverData = await getDrivers();
        console.log(driverData);
        if (driverData) setDrivers(driverData.json);
    };

    const fetchRoutes = async (page: number = 1) => {
        const response = await getRoutes(page);
        if (response.listRoutes.length > 0) {
            setListRoutes(response.listRoutes);
            setTotalPages(response.totalPages);
        } else {
            setListRoutes([]);
        }
    }

    useEffect(() => {
        fetchBuses();
    }, []);

    useEffect(() => {
        fetchRoutes(currentPage);
    }, [currentPage]);


    //Para el switcher
    const handleChange = (checked: boolean) => {
        setFrequencyStatus(checked); //actualizo el estado con el valor del checkbox
    };

    const handleTimeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFillDataTable({
            ...fillDataTable,
            [e.target.id]: e.target.value
        });
    };


    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const frequencyData: FrequencyT = {
            bus_id: selectedBus,
            route_id: fillDataTable.routeID || "",
            departure_time: fillDataTable.departure_time,
            date: fillDataTable.date,
            driver_id: selectedDriver,
            arrival_time: fillDataTable.arrival_time,
            price: parseFloat(fillDataTable.price.replace(',', '.')),
            status: frequencyStatus
        };

        console.log(selectedDriver);
        console.log(frequencyData);
        // Validaciones

        if (!selectedBus || !fillDataTable.routeID || !fillDataTable.departure_time || !fillDataTable.date || !fillDataTable.arrival_time || !selectedDriver || parseFloat(fillDataTable.price.replace(',', '.')) <= 0) {
            toast.error("Por favor, complete todos los campos.");
            return;
        };
        createFrequency(frequencyData);
        cleanData();
        return;
    };


    const handleCancelBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        cleanData();
    };

    const cleanData = () => {
        setSelectedDriver('');
        setSelectedBus('');
        setFillDataTable({
            date: '',
            departure_time: '',
            arrival_time: '',
            routeID: '',
            price: '0',
        });
        setFrequencyStatus(false);
    };

    // Antes del return, busca la ruta seleccionada:
    const selectedRoute = listRoutes.find(route => route.id === fillDataTable.routeID);

    return (
        <>
            <div className="mx-auto max-w-7xl p-8 bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen">
                <Breadcrumb pageName="Registro de Frecuencias" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tabla de rutas */}
                    <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8">
                        <h3 className="text-xl font-bold text-blue-800 mb-6">Listado de Rutas</h3>
                        <PaginationDataTable
                            displayHeader={displayHeader}
                            titles={titles}
                            data={listRoutes}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={(newPage) => {
                                setCurrentPage(newPage);
                                fetchRoutes(newPage);
                            }}
                            loading={loading}
                            onRowClick={(row) => setFillDataTable((prev) => ({
                                ...prev,
                                routeID: row.id,
                                departure_time: row.departure_time || '',
                                arrival_time: row.arrival_time || '',
                                price: row.default_price.toString(),
                            }))}
                            dataHeaderToExpand={expandTitles}
                        />
                    </div>
                    {/* Formulario de registro */}
                    <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8">
                        <h3 className="text-xl font-bold text-blue-800 mb-6">Datos de registro</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Campos solo lectura al inicio */}
                            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-1">Ruta</label>
                                    <div className="text-blue-900 font-bold bg-transparent py-3 px-0">
                                        {selectedRoute
                                            ? `${selectedRoute.departure_station_name} → ${selectedRoute.arrival_station_name}`
                                            : <span className="text-blue-400">Seleccione una ruta</span>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-1">Hora de salida</label>
                                    <div className="text-blue-900 font-bold bg-transparent py-3 px-0">
                                        {fillDataTable.departure_time || <span className="text-blue-400">--:--</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-1">Hora de llegada</label>
                                    <div className="text-blue-900 font-bold bg-transparent py-3 px-0">
                                        {fillDataTable.arrival_time || <span className="text-blue-400">--:--</span>}
                                    </div>
                                </div>
                            </div>
                            {/* Campos editables después */}
                            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-1" htmlFor="bus_select">
                                        Seleccionar bus
                                    </label>
                                    <select
                                        id="bus_select"
                                        className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 focus:ring-2 focus:ring-blue-400 transition"
                                        value={selectedBus}
                                        onChange={(e) => setSelectedBus(e.target.value)}
                                    >
                                        <option value="">Seleccione un bus</option>
                                        {buses.map((bus: any) => (
                                            <option key={bus.id} value={bus.id}>
                                                {bus.license_plate} ({bus.bus_number})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-1" htmlFor="driver_select">
                                        Seleccionar conductor
                                    </label>
                                    <select
                                        id="driver_select"
                                        className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 focus:ring-2 focus:ring-blue-400 transition"
                                        value={selectedDriver}
                                        onChange={(e) => setSelectedDriver(e.target.value)}
                                    >
                                        <option value="">Seleccione un conductor</option>
                                        {drivers.map((driver: any) => (
                                            <option key={driver.dni} value={driver.dni}>
                                                {driver.name} ({driver.dni})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-1" htmlFor="price">
                                        Precio
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-blue-700">
                                            <MdOutlinePriceChange />
                                        </span>
                                        <input
                                            className="w-full rounded-lg border border-blue-300 bg-white py-3 pl-10 pr-4 text-blue-900 focus:ring-2 focus:ring-blue-400 transition"
                                            type="text"
                                            name="price"
                                            id="price"
                                            placeholder="7"
                                            value={fillDataTable.price}
                                            step={0.01}
                                            onChange={handleTimeDateChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-1" htmlFor="bus_company">
                                        Estado
                                    </label>
                                    <div className="flex items-center h-full">
                                        <Switcher
                                            onChange={handleChange}
                                            checked={frequencyStatus}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-blue-900 font-semibold mb-1" htmlFor="date">
                                    Fecha
                                </label>
                                <input
                                    className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 focus:ring-2 focus:ring-blue-400 transition"
                                    type="date"
                                    name="date"
                                    id="date"
                                    onChange={handleTimeDateChange}
                                    value={fillDataTable.date}
                                    min={today}
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="rounded border border-blue-400 py-2 px-6 font-medium text-blue-700 bg-white hover:bg-blue-50 transition"
                                    type="button"
                                    onClick={handleCancelBtn}>
                                    Cancelar
                                </button>
                                <button
                                    className="rounded bg-blue-700 py-2 px-6 font-medium text-white hover:bg-blue-800 transition"
                                    type="submit">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FrequencyRegistration;