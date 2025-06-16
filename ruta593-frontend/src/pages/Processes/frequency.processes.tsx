import { TbBusStop } from "react-icons/tb";
import { MdOutlinePriceChange } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import PaginationDataTable from "../../components/Tables/PaginationDataTable";
import Switcher from "../../components/Switchers/switcher.components";
import { useEffect, useState } from "react";
import useRoutes from "../../hooks/useRoutes";
import useBusCreation from "../../hooks/useBusCreation";
import DataList from "../../components/DataList/datalist.components";
import useUsers from "../../hooks/useUsers";
import { FrequencyT, timeDatePriceT } from "../../types";
import toast from "react-hot-toast";
import useFrequency from "../../hooks/useFrequency";

// DATOS DE PRUEBA RENDERIZADO
const titles = ['id', 'departure_station_name',
    'departure_city_name', 'arrival_station_name',
    'arrival_city_name', 'time'];
const expandTitles = ['stop_station_names', 'stop_city_names'];
const displayHeader = ['Identificador', 'Estación de salida', 'Ciudad de salida',
    'Estación de llegada', 'Ciudad de llegada', 'Horario'];

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

    return (
        <>
            <div className="mx-auto bg-[#172433] min-h-screen">
                <Breadcrumb pageName="Registro de Rutas" />
                <div className="grid grid-cols-8 gap-8">
                    <div className="col-span-8 xl:col-span-5 ">
                        <div className="rounded-sm border border-stroke bg-[#232F41] shadow-default dark:border-strokedark dark:bg-boxdark">
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
                    </div>
                    <div className="col-span-8 xl:col-span-3">
                        <div className="rounded-sm border border-stroke bg-[#232F41] shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                <h3 className="font-medium text-white">
                                    Datos de registro
                                </h3>
                            </div>
                            <div className="p-7">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                        <div className="w-full sm:w-[50%]">
                                            <label className="mb-3 block text-sm font-medium text-white" htmlFor="bus_select">
                                                Seleccionar bus
                                            </label>
                                            <select
                                                id="bus_select"
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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
                                        <div className="w-full sm:w-[50%]">
                                            <label className="mb-3 block text-sm font-medium text-white" htmlFor="driver_select">
                                                Seleccionar conductor
                                            </label>
                                            <select
                                                id="driver_select"
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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

                                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                        <div className="w-full sm:w-[50%]">
                                            <label
                                                className="mb-3 block text-sm font-medium text-white"
                                                htmlFor="price"
                                            >
                                                Precio
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4.5 top-4">
                                                    <MdOutlinePriceChange />
                                                </span>
                                                <input
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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

                                        <div className="w-full sm:w-[50%]">
                                            <label
                                                className="mb-3 block text-sm font-medium text-white"
                                                htmlFor="bus_company"
                                            >
                                                Estado
                                            </label>
                                            <div className="relative">
                                                <Switcher
                                                    onChange={handleChange}
                                                    checked={frequencyStatus}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                        <div className="w-full sm:w-[75%]">
                                            <label
                                                className="mb-3 block text-sm font-medium text-white"
                                                htmlFor="route_id"
                                            >
                                                Ruta
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4.5 top-4">
                                                    <FaRoute />
                                                </span>
                                                <input
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="text"
                                                    name="route_id"
                                                    id="route_id"
                                                    placeholder="Jer2-1622-4"
                                                    value={fillDataTable.routeID}
                                                    onChange={handleTimeDateChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5.5 flex flex-col gap-2.5 sm:flex-row">
                                        <div className="w-full sm:w-[33%]">
                                            <label
                                                className="mb-3 block text-sm font-medium text-white"
                                                htmlFor="date"
                                            >
                                                Fecha
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="date"
                                                    name="date"
                                                    id="date"
                                                    onChange={handleTimeDateChange}
                                                    value={fillDataTable.date}
                                                    min={today}
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-[32%]">
                                            <label
                                                className="mb-3 block text-sm font-medium text-white"
                                                htmlFor="departure_time"
                                            >
                                                Hora de salida
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="time"
                                                    name="departure_time"
                                                    id="departure_time"
                                                    onChange={handleTimeDateChange}
                                                    value={fillDataTable.departure_time}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-[32%]">
                                            <label
                                                className="mb-3 block text-sm font-medium text-white"
                                                htmlFor="arrival_time">
                                                Hora de llegada
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                    type="time"
                                                    name="arrival_time"
                                                    id="arrival_time"
                                                    onChange={handleTimeDateChange}
                                                    value={fillDataTable.arrival_time}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4.5">
                                                                                // ...existing code...
                                        <button
                                            className="flex justify-center rounded bg-red-600 py-2 px-6 font-medium text-white hover:bg-red-700 transition"
                                            type="button"
                                            onClick={handleCancelBtn}>
                                            Cancelar
                                        </button>
                                        // ...existing code...
                                        <button
                                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                            type="submit">
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FrequencyRegistration;