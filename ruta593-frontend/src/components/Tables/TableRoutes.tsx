import { FaTrashCan } from "react-icons/fa6";
interface TableRoutesProps {
    headerTable: string[]; // Propiedades que se usarán para acceder a los datos
    displayHeader: string[];
    children: Array<{ [key: string]: any }>; // Datos que se pasarán como children
    onClick: (id: string) => void; // Función para manejar la acción de clic
}

const TableRoutes = ({ headerTable, displayHeader, children, onClick }: TableRoutesProps) => {

    // Función para acceder a propiedades anidadas
    const getNestedValue = (obj: any, key: string) => {
        return key.split('.').reduce((object, key) => (object || {})[key], obj);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            {displayHeader.map((header: string, index: number) => (
                                <th key={index} className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {children.map((val, key) => (
                            <tr key={key}>
                                {headerTable.map((title, index) => {
                                    const value = getNestedValue(val, title) !== undefined ? getNestedValue(val, title) : '-'; 
                                    return (
                                        <td key={index} className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">{value}</h5>
                                        </td>
                                    );
                                })}
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5">
                                        <button className="hover:text-primary" type="button" onClick={() => onClick(val.id)}>
                                            <FaTrashCan />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableRoutes;
