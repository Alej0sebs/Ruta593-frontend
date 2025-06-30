import { TbBusStop } from "react-icons/tb";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import React, { useEffect, useState } from "react";
import TableRoutes from "../../components/Tables/TableRoutes";
import DataListBusStation from "../../components/DataList/datalistBusStation.component";
import useBusStations from "../../hooks/useBusStations";
import { BusStationT, timeAndPriceT } from "../../types";
import toast from "react-hot-toast";
import useRoutes from "../../hooks/useRoutes";
import Switcher from "../../components/Switchers/switcher.components";
import PaginationDataTable from "../../components/Tables/PaginationDataTable";

const initialStateTimeDate: timeAndPriceT = {
    departure_time: '',
    arrival_time: '',
    price: 0
};

const titles = [
    'departure_station_name',
    'departure_city_name',
    'arrival_station_name',
    'arrival_city_name',
    'time'
];
const expandTitles: string[] = [];
const displayHeader = [
    'Estación de salida',
    'Ciudad de salida',
    'Estación de llegada',
    'Ciudad de llegada',
    'Horario'
];

const RoutesRegistration = () => {
    const [isStopsEnabled, setIsStopsEnabled] = useState(false);
    const [stopOvers, setStopOvers] = useState<BusStationT[]>([]);
    const { dataListBusStations } = useBusStations();
    const [selectedDepartureStation, setSelectedDepartureStation] = useState("");
    const [selectedArrivalStation, setSelectedArrivalStation] = useState("");
    const [selectedStopOver, setSelectedStopOver] = useState("");
    const [selectedDataTimeAndPrice, setSelectedDataTimeAndPrice] = useState<timeAndPriceT>(initialStateTimeDate);
    const { loading, getRoutes } = useRoutes();
    const [listRoutes, setListRoutes] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { createRoute } = useRoutes();

    const fetchRoutes = async (page: number = 1) => {
        const response = await getRoutes(page);
        if (response.listRoutes.length > 0) {
            setListRoutes(response.listRoutes);
            setTotalPages(response.totalPages);
        } else {
            setListRoutes([]);
        }
    };

    useEffect(() => {
        fetchRoutes(currentPage);
    }, [currentPage]);

    const handleChange = (checked: boolean) => {
        setIsStopsEnabled(checked);
    };

    const handleTimeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDataTimeAndPrice({
            ...selectedDataTimeAndPrice,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedDepartureStation || !selectedArrivalStation) return toast.error("Debe seleccionar una estación de salida y una estación de llegada");
        if (!selectedDataTimeAndPrice.departure_time || !selectedDataTimeAndPrice.arrival_time) return toast.error("Debe seleccionar una hora de salida y una hora de llegada");
        if (!selectedDataTimeAndPrice.price) return toast.error("Debe ingresar un precio para la ruta");

        const departure_station_id: number = parseInt(selectedDepartureStation);
        const arrival_station_id: number = parseInt(selectedArrivalStation);
        const stopOverList: number[] = stopOvers.map((station) => Number(station.id));

        const wasCreated = await createRoute({
            departure_station_id,
            arrival_station_id,
            stopOverList,
            departure_time: selectedDataTimeAndPrice.departure_time,
            arrival_time: selectedDataTimeAndPrice.arrival_time,
            default_price: Number(selectedDataTimeAndPrice.price)
        });
        if (wasCreated) cleanData();
    };

    const handleCancelBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        cleanData();
    };

    const cleanData = () => {
        setSelectedDepartureStation("");
        setSelectedArrivalStation("");
        setSelectedStopOver("");
        setStopOvers([]);
        setSelectedDataTimeAndPrice(initialStateTimeDate);
    };

    const handleAddStopOver = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const stopOver = stopOversOptions.find((station) => station.id === selectedStopOver);
        const stopOverExists = stopOvers.find((station) => station.id === stopOver?.id);
        if (stopOverExists) {
            toast.error("La parada ya ha sido agregada");
            setSelectedStopOver("");
        } else if (stopOver) {
            setStopOvers([...stopOvers, stopOver]);
            setSelectedStopOver("");
        }
    };

    const departureOptions = dataListBusStations.filter((station) => station.id !== selectedArrivalStation);
    const arrivalOptions = dataListBusStations.filter((station) => station.id !== selectedDepartureStation);
    const stopOversOptions = dataListBusStations.filter((station) => station.id !== selectedDepartureStation && station.id !== selectedArrivalStation);

    return (
        <div className="mx-auto max-w-7xl p-6 bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen">
            <Breadcrumb pageName="Registro de Frecuencias" />
            <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">Gestión de Rutas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8">
                    <h3 className="text-xl font-bold text-blue-800 mb-6">Información de la Ruta</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div>
                                <DataListBusStation
                                    id="departure_station"
                                    label="Estación de salida"
                                    options={departureOptions}
                                    placeholder="Estación A"
                                    onSelect={(value) => setSelectedDepartureStation(value)}
                                    value={selectedDepartureStation}
                                    iconP={TbBusStop}
                                />
                            </div>
                            <div>
                                <DataListBusStation
                                    id="arrival_station"
                                    label="Estación de llegada"
                                    options={arrivalOptions}
                                    placeholder="Estación B"
                                    onSelect={(value) => setSelectedArrivalStation(value)}
                                    value={selectedArrivalStation}
                                    iconP={TbBusStop}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-blue-900 font-semibold mb-1">Hora de salida</label>
                                <input
                                    type="time"
                                    name="departure_time"
                                    id="departure_time"
                                    value={selectedDataTimeAndPrice.departure_time}
                                    onChange={handleTimeDateChange}
                                    className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 outline-none focus:ring-2 focus:ring-blue-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-blue-900 font-semibold mb-1">Hora de llegada</label>
                                <input
                                    type="time"
                                    name="arrival_time"
                                    id="arrival_time"
                                    value={selectedDataTimeAndPrice.arrival_time}
                                    onChange={handleTimeDateChange}
                                    className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 outline-none focus:ring-2 focus:ring-blue-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-blue-900 font-semibold mb-1">Precio</label>
                                <input
                                    className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    type="number"
                                    name="price"
                                    id="price"
                                    placeholder="7"
                                    value={selectedDataTimeAndPrice.price}
                                    step={0.01}
                                    onChange={handleTimeDateChange}
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-blue-900 font-semibold mb-1">¿Asignar Paradas?</label>
                            <Switcher checked={isStopsEnabled} onChange={handleChange} />
                        </div>
                        {isStopsEnabled && (
                            <div className="mb-6">
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <DataListBusStation
                                            id="stop_over"
                                            label="Agregar Paradas"
                                            options={stopOversOptions}
                                            placeholder="Parada"
                                            onSelect={(value) => setSelectedStopOver(value)}
                                            value={selectedStopOver}
                                            iconP={TbBusStop}
                                        />
                                    </div>
                                    <button
                                        className="rounded bg-green-700 py-2 px-6 font-medium text-white hover:bg-green-800 transition"
                                        type="button"
                                        onClick={handleAddStopOver}
                                    >
                                        Agregar
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <TableRoutes
                                        headerTable={['id', 'name', 'city_bus_station.name']}
                                        displayHeader={['id', 'Estacion de bus', 'Ciudad', 'Acciones']}
                                        onClick={(id) => { setStopOvers(stopOvers.filter((station) => station.id !== id)) }}
                                    >
                                        {stopOvers}
                                    </TableRoutes>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-4">
                            <button
                                className="rounded border border-blue-400 py-2 px-6 font-medium text-blue-700 bg-white hover:bg-blue-50 transition"
                                type="button"
                                onClick={handleCancelBtn}
                            >
                                Cancelar
                            </button>
                            <button
                                className="rounded bg-blue-700 py-2 px-6 font-medium text-white hover:bg-blue-800 transition"
                                type="submit"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
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
                        dataHeaderToExpand={expandTitles}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoutesRegistration;
