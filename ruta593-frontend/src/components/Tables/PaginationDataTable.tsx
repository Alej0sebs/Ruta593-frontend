import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface PaginationDataTableProps {
  titles: string[];
  displayHeader: string[];
  data: Array<{ [key: string]: any }>;
  totalPages: number;
  currentPage: number;
  tableName?: string;
  onPageChange: (newPage: number) => void;
  loading: boolean;
  onRowClick?: (row: any) => void;
  dataHeaderToExpand: string[];
}

const PaginationDataTable: React.FC<PaginationDataTableProps> = ({
  titles,
  data,
  totalPages,
  currentPage,
  tableName,
  onPageChange,
  loading,
  onRowClick,
  displayHeader,
  dataHeaderToExpand,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleExpandRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      {tableName && (
        <h4 className="mb-4 text-xl font-semibold text-[#0F1A2F]">{tableName}</h4>
      )}
      {loading ? (
        <div className="text-center text-gray-700">Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-[#0F1A2F] text-white">
              <tr>
                {dataHeaderToExpand.length > 0 && (
                  <th className="p-3 text-center w-10"></th>
                )}
                {displayHeader.map((title, index) => (
                  <th
                    key={index}
                    className="p-3 text-sm font-semibold uppercase text-center"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={titles.length + 1} className="text-center py-4">
                    No hay datos disponibles.
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <tr
                      onClick={() => onRowClick?.(row)}
                      className={`${
                        rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'
                      } hover:bg-[#e0f0ff] transition cursor-pointer`}
                    >
                      {dataHeaderToExpand.length > 0 && (
                        <td className="text-center">
                          <button onClick={() => toggleExpandRow(rowIndex)}>
                            <IoIosArrowDown
                              className={`mx-auto transform transition-transform ${
                                expandedRow === rowIndex ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </td>
                      )}
                      {titles.map((title, colIndex) => (
                        <td
                          key={colIndex}
                          className="p-3 text-center text-[#0F1A2F] text-sm"
                        >
                          {row[title] !== undefined ? row[title] : '-'}
                        </td>
                      ))}
                    </tr>
                    {expandedRow === rowIndex && dataHeaderToExpand.length > 0 && (
                      <tr>
                        <td
                          colSpan={titles.length + 1}
                          className="p-4 bg-gray-100 text-sm"
                        >
                          {dataHeaderToExpand.map((field, idx) => (
                            <div key={idx} className="mb-1 text-[#0F1A2F]">
                              <strong>{field}: </strong>
                              {row[field] || '-'}
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-[#0F1A2F] font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PaginationDataTable;
