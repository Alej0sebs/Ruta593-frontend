import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { BusLayoutConfigurationT, clientTicketT, SeatConfigT, SelectedSeatT } from "../../types";
import toast from "react-hot-toast";
import Accordion from "../../components/Accordion";
import Tabs from "../../components/Tabs";
import SalesForm from "../../components/Forms/SalesForm";
import { AlertCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import SvgSeatComponent from "../../components/busElements/svgSeats.components";
import useSeatStructure from "../../hooks/useSeatStructure";
import SvgBathroomComponent from "../../components/busElements/svgBathroom.components";
import SvgStairsComponent from "../../components/busElements/svgStairs.components";
import BusTemplate from "../../components/Bus";
import { useSelectedSeatsStore } from "../../Zustand/useSelectedSeats";
import PaginationDataTable from "../../components/Tables/PaginationDataTable";
import { useSellTicket } from "../../hooks/useSellTicket";
import { TicketData } from "../../types/ticket";
import PDFPopup from "../../modals/pdfPopup";
import useFrequency from "../../hooks/useFrequency";

interface InputFieldProps {
    label: string;
    value: string;
    isWide?: boolean;
}
interface BusData {
    [floor: string]: BusLayoutConfigurationT[];
}

const TicketsalesRegistration = () => {
    const location = useLocation();
    const [frequencyData, setFrequencyData] = useState<any>(null);
    const [frequencies, setFrequencies] = useState<any[]>([]);
    const [loadingFrequencies, setLoadingFrequencies] = useState(false);
    const { getFrequencies } = useFrequency();
    const { getSeatStructure } = useSeatStructure();
    const [floorElements, setFloorElements] = useState<{ [key: number]: SeatConfigT[] }>({});
    const [numFloors, setNumFloors] = useState(1);
    const [selectedFloor, setSelectedFloor] = useState(1);
    const { selectedSeats, addSeat, removeSeat, clearSeats } = useSelectedSeatsStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [reloadBusConfigAfterSale, setReloadBusConfigAfterSale] = useState(false);
    const [clientList, setClientList] = useState<clientTicketT[]>([]);
    const { getTicketsClientFrequency, getTicketBySeat } = useSellTicket();
    const [ticketsData, setTicketsData] = useState<TicketData[]>([]);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [totalSeats, setTotalSeats] = useState(0);
    const [reservedSeats, setReservedSeats] = useState(0);

    useEffect(() => {
        const fetchFrequencies = async () => {
            setLoadingFrequencies(true);
            const response = await getFrequencies();
            setFrequencies(response || []);
            setLoadingFrequencies(false);
        };
        fetchFrequencies();
    }, []);

    useEffect(() => {
        if (frequencyData) {
            fetchTicketsClientFrequency(currentPage);
            fetchBusConfiguration();
        }
    }, [frequencyData, reloadBusConfigAfterSale]);

    const fetchBusConfiguration = async () => {
        try {
            const { id: frequency_id, bus_id, bus_structure_id } = frequencyData;
            const busData: BusData = await getSeatStructure({ frequency_id, bus_id, bus_structure_id });
            if (busData) {
                const numFloors = Object.keys(busData).length;
                setNumFloors(numFloors);
                setFloorElements(busData);

                const countTotalSeats = Object.values(busData).reduce((acc, floor) => {
                    const seatCount = floor.filter((e) => e.type === "seat").length;
                    return acc + seatCount;
                }, 0);
                setTotalSeats(countTotalSeats);

                const reserved = Object.values(busData).reduce((acc, floor) => {
                    const seatCount = floor.filter((e) => e.status === "r").length;
                    return acc + seatCount;
                }, 0);
                setReservedSeats(reserved);
            }
        } catch {
            toast.error('Error al obtener la estructura del bus');
        }
    };

    const fetchTicketsClientFrequency = async (page = 1) => {
        try {
            const { id: frequency_id } = frequencyData;
            const response = await getTicketsClientFrequency(frequency_id, page);
            if (response) {
                setClientList(response.message.clientList);
                setTotalPages(response.message.totalPages);
            }
        } catch {
            toast.error('Error al obtener los datos de los clientes');
        }
    };

    const handleSeatClick = async (seat: SelectedSeatT) => {
        if (seat.statusSeat === "r") {
            try {
                const ticket = await getTicketBySeat(frequencyData.id, seat.seatId);
                if (ticket) {
                    setTicketsData([JSON.parse(ticket.message)]);
                    setShowPdfModal(true);
                } else {
                    toast.error("No se encontró información para este asiento.");
                }
            } catch {
                toast.error("Error al obtener los datos del ticket.");
            }
        } else if (isSeatSelected(seat.seatId)) {
            removeSeat(seat.seatId);
        } else {
            addSeat(seat);
        }
    };

    const handleClientSeatClick = async (seatID: string) => {
        try {
            const ticket = await getTicketBySeat(frequencyData.id, seatID);
            if (ticket) {
                setTicketsData([JSON.parse(ticket.message)]);
                setShowPdfModal(true);
            } else {
                toast.error("No se encontró información para este asiento.");
            }
        } catch {
            toast.error("Error al obtener los datos del ticket.");
        }
    };

    const isSeatSelected = (seatId: string) => {
        return selectedSeats.some((seat) => seat.seatId === seatId);
    };

    const toggleReload = () => {
        setReloadBusConfigAfterSale((prev) => !prev);
        clearSeats();
        fetchTicketsClientFrequency(currentPage);
    };

    const statuses = [
        { label: 'Libre', count: (totalSeats - reservedSeats).toString(), statusSeat: 'free', name: 'F' },
        { label: 'Reservados', count: reservedSeats.toString(), statusSeat: 'reserved', name: 'R' },
    ];

    const travelData = {
        placa: frequencyData?.license_plate || '',
        piloto: frequencyData?.driver_name || '',
        copiloto: 'No asignado',
        libres: (totalSeats - reservedSeats).toString(),
        reservados: reservedSeats.toString(),
        total: totalSeats.toString(),
        horaSalida: frequencyData?.departure_time || '',
        dia: frequencyData?.date || '',
        fechaViaje: frequencyData?.date || '',
        horaLlegada: frequencyData?.arrival_time || '',
        terminal: `${frequencyData?.departure_station_name || ''} - ${frequencyData?.departure_city_name || ''}`,
    };

    const InputField = ({ label, value, isWide = false }: InputFieldProps) => (
        <div className={`mb-4 ${isWide ? 'col-span-2' : ''}`}>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <input
                type="text"
                value={value}
                disabled
                className="w-full rounded-lg border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 text-gray-700 outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-gray-300"
            />
        </div>
    );

    const tabsData = [
        { title: 'Ventas', content: <SalesForm dataFrequency={frequencyData} onUpdateBus={toggleReload} /> },
        {
            title: 'Clientes',
            content:
                <PaginationDataTable
                    titles={['client_dni', 'client_name', 'ticket_code', 'seat_id']}
                    displayHeader={['DNI', 'Nombre', 'Codigo', 'Asiento']}
                    data={clientList}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(newPage) => {
                        setCurrentPage(newPage);
                        fetchTicketsClientFrequency(newPage);
                    }}
                    onRowClick={(row) => handleClientSeatClick(row.seat_id)}
                    loading={false}
                    dataHeaderToExpand={[]}
                />
        }
    ];

    if (!frequencyData) {
        return (
            <div className="mx-auto max-w-2xl p-8 bg-white rounded-xl shadow-lg mt-10 border border-blue-200">
                <Breadcrumb pageName="Venta de tickets" />
                <h2 className="mb-6 text-2xl font-bold text-blue-900 text-center">Selecciona una Ruta</h2>
                {loadingFrequencies ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></span>
                        <span className="ml-4 text-blue-700 font-semibold">Cargando Rutas...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {frequencies.length === 0 ? (
                            <div className="text-center text-gray-500">No hay Rutas disponibles.</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {frequencies.map(freq => (
                                    <button
                                        key={freq.id}
                                        className="w-full text-left bg-gradient-to-r from-blue-100 to-blue-300 hover:from-blue-200 hover:to-blue-400 border border-blue-300 rounded-lg p-5 shadow transition flex flex-col md:flex-row md:items-center md:justify-between"
                                        onClick={() => setFrequencyData(freq)}
                                    >
                                        <div>
                                            <div className="text-lg font-bold text-blue-900">
                                                {freq.departure_station_name} → {freq.arrival_station_name}
                                            </div>
                                            <div className="text-sm text-blue-700 mt-1">
                                                {freq.date} | {freq.departure_time} - {freq.arrival_time}
                                            </div>
                                        </div>
                                        <div className="mt-2 md:mt-0 flex flex-col md:items-end">
                                            <span className="text-xs text-gray-500">Bus: <span className="font-semibold">{freq.license_plate || 'Sin placa'}</span></span>
                                            <span className="text-xs text-gray-500">Piloto: <span className="font-semibold">{freq.driver_name || 'Sin asignar'}</span></span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto max-w-7xl p-4">
                <Breadcrumb pageName="Selección de asientos" />
                <div className="flex flex-col md:flex-row gap-15 mt-4">
                    <div className="max-w-[350px] min-w-[256px] md:w-[300px] flex-shrink-0">
                        <div className="controls mb-4">
                            <label className="mr-4">Piso actual:</label>
                            <select
                                value={selectedFloor}
                                onChange={(e) => setSelectedFloor(parseInt(e.target.value, 10))}
                                className="border border-gray-300 rounded px-2 py-1 bg-transparent transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            >
                                {Array.from({ length: numFloors }, (_, i) => i + 1).map((floor) => (
                                    <option key={floor} value={floor}>Piso {floor}</option>
                                ))}
                            </select>
                        </div>
                        <div id={`bus-container-${selectedFloor}`} className="relative h-[600px] w-full border-4 border-gray-700 rounded-2xl bg-gradient-to-b from-gray-300 to-gray-100 shadow-lg">
                            <BusTemplate floorNumber={selectedFloor}>
                                {floorElements[selectedFloor]?.map((element) => (
                                    <div
                                        key={element.id}
                                        id={element.id}
                                        className={`absolute cursor-pointer`}
                                        style={{ left: `${element.position.x}%`, top: `${element.position.y}%` }}
                                        onClick={() => element.type === 'seat' && handleSeatClick({ seatId: element.id, additionalCost: element.additionalCost || 0, statusSeat: element.status! })}
                                    >
                                        {element.type === 'seat' && (
                                            <SvgSeatComponent
                                                name={element.name}
                                                isSelected={isSeatSelected(element.id)}
                                                status={element.status ? element.status.toLowerCase() : "f"}
                                            />
                                        )}
                                        {element.type === 'bathroom' && <SvgBathroomComponent />}
                                        {element.type === 'stairs' && <SvgStairsComponent />}
                                    </div>
                                ))}
                            </BusTemplate>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <Tabs tabs={tabsData} />
                    </div>
                </div>
            </div>
            {showPdfModal && <PDFPopup tickets={ticketsData} />}
        </>
    );
};

export default TicketsalesRegistration;
