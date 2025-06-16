import { SelectedSeatT } from "../../types";

interface TableTicketsProps {
    headerTable: string;
    displayData: SelectedSeatT[];
    onSelectSeat: (seat: SelectedSeatT) => void; // Nueva función para seleccionar asiento
}

const TableSeats = ({ headerTable, displayData, onSelectSeat }: TableTicketsProps) => {
    return (
        <div className="h-55 overflow-x-auto">
            <table className="table table-pin-rows">
                <thead>
                    <tr>
                        <th>{headerTable}</th>
                        <th>Pasajero</th>
                        <th>Destino de viaje final</th>
                        <th>C. Adicional</th>
                        <th>C. Trayecto</th>
                        <th>Descuento</th>
                        <th>C. Final</th>
                    </tr>
                </thead>
                <tbody>
                    {displayData.map((val: SelectedSeatT, index: number) => (
                        <tr
                            key={index}
                            onClick={() => onSelectSeat(val)} // Asignar asiento al hacer clic
                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700" // Agregar feedback visual
                        >
                            <td>{val.seatId}</td>
                            <td>{val.client?.name} {val.client?.last_name}</td>
                            <td>{val.destination}</td>
                            <td>${val.additionalCost}</td>
                            <td>${val.priceDestination}</td>
                            <td>{(val.discount || 0) * 100}%</td>
                            <td>${((val.priceDestination ? Number(val.priceDestination) : 0) - (val.priceDestination ? Number(val.priceDestination) : 0) * (val.discount || 0)) + Number(val.additionalCost)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableSeats;
