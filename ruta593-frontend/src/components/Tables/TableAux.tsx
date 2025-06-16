import React from 'react';

interface Props {
  headerTable: string[];
  displayHeader: string[];
  children: any[];
}

const TableAux: React.FC<Props> = ({ headerTable, displayHeader, children }) => {
  return (
    <div className="bg-[#0F1A2F] rounded-xl shadow-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Tipos de Asiento Registrados</h3>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left text-white">
          <thead className="bg-[#FEDD00] text-[#0F1A2F] uppercase text-sm">
            <tr>
              {displayHeader.map((header, idx) => (
                <th key={idx} className="px-6 py-3 font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children.length === 0 ? (
              <tr>
                <td colSpan={headerTable.length} className="text-center py-4 text-white">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              children.map((item, index) => (
                <tr key={index} className="border-b border-gray-600 hover:bg-[#172B4D] transition">
                  {headerTable.map((key, i) => (
                    <td key={i} className="px-6 py-4">
                      {item[key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableAux;
