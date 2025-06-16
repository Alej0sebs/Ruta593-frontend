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

interface InputFieldProps {
    label: string;
    value: string;
    isWide?: boolean;
}
interface BusData {
    [floor: string]: BusLayoutConfigurationT[];
}

const TicketsalesRegistration = () => {
    //get data from frequency
    const location = useLocation();
    const { frequencyData } = location.state || {};
    if (!frequencyData) {
        return <div>No se han seleccionado datos de una frecuencia</div>
    }
    //hooks
    const { getSeatStructure } = useSeatStructure();

    //useState
    const [floorElements, setFloorElements] = useState<{ [key: number]: SeatConfigT[] }>({}); // Almacenar los elementos del bus por piso
    const [numFloors, setNumFloors] = useState(1); // Número de pisos
    const [selectedFloor, setSelectedFloor] = useState(1); // Piso seleccionado para visualizar
    const { selectedSeats, addSeat, removeSeat, clearSeats } = useSelectedSeatsStore();

    //state para paginas
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //State para renderizar cuando haga la compra de un boleto
    const [reloadBusConfigAfterSale, setReloadBusConfigAfterSale] = useState(false);
    //Datos de los clientes que han comprado boletos en la frecuencia
    const [clientList, setClientList] = useState<clientTicketT[]>([]);
    const { getTicketsClientFrequency, getTicketBySeat } = useSellTicket();

    const [ticketsData, setTicketsData] = useState<TicketData[]>([]);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [totalSeats, setTotalSeats] = useState(0);
    const [reservedSeats, setReservedSeats] = useState(0);
    //global variables

    //Traer los datos de la estructura de los asientos con sus respectivos ids
    const fetchBusConfiguration = async () => {
        try {
            const { id: frequency_id, bus_id, bus_structure_id } = frequencyData;
            const busData: BusData = await getSeatStructure({ frequency_id, bus_id, bus_structure_id });
            if (busData) {
                const numFloors = Object.keys(busData).length;
                setNumFloors(numFloors);
                setFloorElements(busData);

                // Calcula el número total de asientos
                const countTotalSeats = Object.values(busData).reduce((acc, floor) => {
                    const seatCount = floor.filter((element: any) => element.type === "seat").length;
                    return acc + seatCount;
                }, 0);
                setTotalSeats(countTotalSeats);

                const reservedSeats = Object.values(busData).reduce((acc, floor) => {
                    const seatCount = floor.filter((element: any) => element.status === "r").length;
                    return acc + seatCount;
                },0);
                setReservedSeats(reservedSeats);
            }
        } catch (err) {
            toast.error('Error al obtener la estructura del bus');
        }
    };

    //Traer los datos de los clientes de la frecuencia
    const fetchTicketsClientFrequency = async (page = 1) => {
        try {
            const { id: frequency_id } = frequencyData;
            const response = await getTicketsClientFrequency(frequency_id, page);

            if (response) {
                setClientList(response.message.clientList);
                setTotalPages(response.message.totalPages);
            }
        } catch (err) {
            toast.error('Error al obtener los datos de los clientes');
        }
    };

    //Tomo los valores de la frecuencia
    useEffect(() => {
        fetchTicketsClientFrequency(currentPage);
        fetchBusConfiguration();
    }, [frequencyData, reloadBusConfigAfterSale]);

    //Funcion para traer los datos de los tickets 
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


    //Funcion para renderizar la pagina principal

    const toggleReload = () => {
        setReloadBusConfigAfterSale((prev) => !prev);
        clearSeats();
        fetchTicketsClientFrequency(currentPage);
    };

    const tabsData = [
        { title: 'Ventas', content: <SalesForm dataFrequency={frequencyData} onUpdateBus={toggleReload} /> },
        {
            title: 'Clientes',
            content:
                <PaginationDataTable
                    titles={['client_dni', 'client_name', 'ticket_code', 'seat_id']} // Claves ajustadas a los datos aplanados
                    displayHeader={['DNI', 'Nombre', 'Codigo', 'Asiento']} // Encabezados de columnas
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

    //Contabilizar los datos de los asientos segun la estructura
    const statuses = [
        { label: 'Libre', count: (totalSeats - reservedSeats).toString(), statusSeat: 'free', name: 'F' },
        { label: 'Reservados', count: reservedSeats.toString(), statusSeat: 'reserved', name: 'R' },
    ];

    // Estos datos vendrían de una consulta en una aplicación real
    const travelData = {
        placa: frequencyData.license_plate,
        piloto: frequencyData.driver_name,
        copiloto: 'No asignado',
        libres: (totalSeats - reservedSeats).toString(), //Asientos libres
        reservados: reservedSeats.toString(), //Asientos
        total: totalSeats.toString(), //Total de asientos del bus como se renderiza ya que toma el valor inicial de 0
        horaSalida: frequencyData.departure_time,
        dia: frequencyData.date,
        fechaViaje: frequencyData.date,
        horaLlegada: frequencyData.arrival_time,
        terminal: `${frequencyData.departure_station_name} - ${frequencyData.departure_city_name}`,
    };

    const InputField = ({ label, value, isWide = false }: InputFieldProps) => (
        <div className={`mb-4 ${isWide ? 'col-span-2' : ''}`}>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <input
                type="text"
                value={value}
                disabled
                className="w-full rounded-lg border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 text-gray-700 outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-gray-300"
            />
        </div>
    );



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
                                    <option key={floor} value={floor}>
                                        Piso {floor}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div
                            id={`bus-container-${selectedFloor}`}
                            className="relative h-[600px] w-full border-4 border-gray-700 rounded-2xl bg-gradient-to-b from-gray-300 to-gray-100 shadow-lg"
                        >
                            <BusTemplate floorNumber={selectedFloor}>
                                {floorElements[selectedFloor]?.map((element) => (
                                    <div
                                        key={element.id}
                                        id={element.id}
                                        className={`absolute cursor-pointer ${element.type === 'seat' && isSeatSelected(element.id)}`}
                                        style={{
                                            left: `${element.position.x}%`,
                                            top: `${element.position.y}%`,
                                        }}
                                        onClick={() => element.type === 'seat' && handleSeatClick({ seatId: element.id, additionalCost: element.additionalCost || 0, statusSeat: element.status! })}
                                    >
                                        {element.type === 'seat' && (
                                            <SvgSeatComponent
                                                name={element.name}
                                                isSelected={isSeatSelected(element.id)}
                                                status={element.status ? element.status.toLowerCase() : "f"} // Puedes ajustar el estado según tus datos
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
                        <Accordion title="Descripción" color="#4A90E2">
                            <div className="flex p-4">
                                {statuses.map((statusSeat) => (
                                    <div key={statusSeat.label} className="flex items-center  mx-auto">
                                        <SvgSeatComponent name={statusSeat.name} isSelected={false} status={statusSeat.name.toLowerCase()} />
                                        <div className="flex flex-col">
                                            <span className="text-lg font-medium text-black dark:text-white">{statusSeat.label}</span>
                                            <span className="text-base text-black dark:text-white">{statusSeat.label.toLowerCase()}: {statusSeat.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Accordion>
                        <Accordion title="Detalle de Bus Baños - Quito" color="#f4c05c">
                            <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                                <InputField label="PLACA DE BUS" value={travelData.placa} />
                                <InputField label="ASIENTOS" value={travelData.total} />
                                <InputField label="LIBRES" value={travelData.libres} />
                                <InputField label="PILOTO" value={travelData.piloto} />
                                <InputField label="RESERVADOS" value={travelData.reservados} />
                                <InputField label="HORA SALIDA" value={travelData.horaSalida} />
                                <InputField label="DIA" value={travelData.dia} />
                                <InputField label="FECHA DE VIAJE" value={travelData.fechaViaje} />
                                <InputField label="HORA PARTIDA" value={travelData.horaLlegada} />
                            </div>
                        </Accordion>

                        <Tabs tabs={tabsData} />
                    </div>
                </div>
            </div >
            {showPdfModal && (
                <PDFPopup tickets={ticketsData} />
            )}
        </>
    );


};

export default TicketsalesRegistration;
