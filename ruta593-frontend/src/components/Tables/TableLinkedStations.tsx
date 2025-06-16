import React from 'react';
import { LinkCooperativesT } from '../../types'; // Ajusta la ruta si es necesario

interface TableLinkedStationsProps {
  data: LinkCooperativesT[];
}

const TableLinkedStations: React.FC<TableLinkedStationsProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full text-sm text-left text-white">
        <thead className="bg-[#FEDD00] text-[#0F1A2F] uppercase text-sm">
          <tr>
            <th className="px-6 py-3 font-bold">Ciudad</th>
            <th className="px-6 py-3 font-bold">Estación</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center py-4">
                No hay estaciones vinculadas.
              </td>
            </tr>
          ) : (
            data.map((station) => (
              <tr
                key={station.station_id}
                className="border-b border-gray-600 hover:bg-[#172B4D] transition"
              >
                <td className="px-6 py-4">{station.city_name}</td>
                <td className="px-6 py-4">{station.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableLinkedStations;
