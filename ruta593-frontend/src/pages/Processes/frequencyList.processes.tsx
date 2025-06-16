import { CiEdit } from "react-icons/ci";
import { IoTicketSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import useFrequency from "../../hooks/useFrequency";
import { editFrequencyT, FrequencyListObjectT, FrequencyListT } from "../../types";
import DeletePopup from "../../modals/deletePopup.processes";
import EditPopup from "../../modals/editPopup.processes";
import useBusCreation from "../../hooks/useBusCreation";
import useUsers from "../../hooks/useUsers";
import DataList from "../../components/DataList/datalist.components";
import toast from "react-hot-toast";

const initialPopupData: editFrequencyT = {
    id: "",
    bus_id: "",
    license_plate: "",
    route_id: "",
    departure_time: "",
    date: "",
    arrival_time: "",
    driver_id: "",
    price: 0,
    status: false
};

const FrequencyList = () => {
    //navigate
    const navigate = useNavigate();

    const [listRoutes, setListRoutes] = useState<FrequencyListT>([]);
    const { getFrequencies, editFrequency, deleteFrequency } = useFrequency();
    //edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [inputModalData, setInputModalData] = useState<editFrequencyT>(initialPopupData);
    //hooks
    const { getBuses } = useBusCreation();
    const { getDrivers } = useUsers();
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchBuses = async () => {
            const frequenciesList = await getFrequencies();
            if (frequenciesList && (frequenciesList.id != null || frequenciesList.id != "")) setListRoutes(frequenciesList);
            const busData = await getBuses();
            if (busData) setBuses(busData);
            const driverData = await getDrivers();
            if (driverData) setDrivers(driverData.json);
        };
        fetchBuses();
    }, [reload]);

    const toggleStatus = async (id: string) => {
        setListRoutes((prev: FrequencyListT) =>
            prev.map((freq) =>
                freq.id === id
                    ? { ...freq, status: !freq.status }
                    : freq)
        );

        const newStatus = !listRoutes.find((freq) => freq.id === id)?.status;
        await editFrequency({ id, status: newStatus });
    };

    const handleDelete = async (id: string) => {
        await deleteFrequency(id);
        setReload((prev) => !prev);
    }

    const openEditModal = (freq: editFrequencyT) => {
        setInputModalData(freq);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    //manage edit inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputModalData({
            ...inputModalData,
            [e.target.name]: e.target.value
        })
    };

    const handleSelectBus = (selectedBus: any) => {
        setInputModalData({
            ...inputModalData,
            bus_id: selectedBus.id,
            license_plate: selectedBus.license_plate,
        });
    };

    const handleSelectDriver = (selectedDriver: any) => {
        setInputModalData({
            ...inputModalData,
            driver_id: selectedDriver.id,
        });
    };
    //close manage edit inputs
    const handleSubmit = async () => {
        await editFrequency(inputModalData);
        closeEditModal();
        setReload((prev) => !prev);
    };

    const handleTicketView = (rowData: FrequencyListObjectT) => {
        navigate('/processes/ticketsales', { state: { frequencyData: rowData } });
    };

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Lista de frecuencias disponibles" />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Ruta
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Estaciones
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Autobus
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Fecha
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Horario
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Estado
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listRoutes.map((freq) => (
                                <tr key={freq.id}>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {freq.departure_city_name} - {freq.arrival_city_name}
                                        </h5>
                                        <p className="text-sm">
                                            {freq.stop_city_names !== null ? freq.stop_city_names : ""}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {freq.departure_station_name} - {freq.arrival_station_name}
                                        </h5>
                                        <p className="text-sm">
                                            {freq.stop_station_names !== null ? freq.stop_station_names : ""}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {freq.license_plate}
                                        </h5>
                                        <p className="text-sm">
                                            {freq.bus_number}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{freq.date}</p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {freq.departure_time} - {freq.arrival_time}
                                        </h5>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                value="synthwave"
                                                checked={freq.status}
                                                className="toggle theme-controller col-span-2 col-start-1 row-start-1 bg-blue-300 [--tglbg:theme(colors.blue.900)] checked:border-blue-800 checked:bg-blue-50 checked:[--tglbg:theme(colors.green.500)]"
                                                onChange={() => toggleStatus(freq.id)} />
                                        </label>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button className="hover:text-primary" onClick={() => {
                                                if (freq.status) {
                                                    handleTicketView(freq);
                                                } else {
                                                    toast.error("La frecuencia está inactiva.");
                                                }
                                            }}><IoTicketSharp /></button>
                                            <button className="hover:text-primary" onClick={() => openEditModal(freq)}><CiEdit /></button>
                                            {/* popup */}
                                            <EditPopup
                                                title="Editar Frecuencia"
                                                isOpen={isEditModalOpen}
                                                onClose={closeEditModal}
                                                onSave={handleSubmit}
                                            >
                                                <div className="flex flex-col space-y-4 text-black dark:text-white">
                                                    <label>
                                                        <DataList
                                                            id={"license_plate"}
                                                            label="Placa autobús"
                                                            placeholder="TAR-2107"
                                                            options={buses}
                                                            opKey={"id"}
                                                            opValue={"license_plate"}
                                                            optionP={"bus_number"}
                                                            onSelect={handleSelectBus}
                                                            value={inputModalData.bus_id || ""}
                                                        />
                                                    </label>
                                                    <label>
                                                        <DataList
                                                            id={"driver_id"}
                                                            label="Conductor"
                                                            placeholder="18xxxxxxxx"
                                                            options={drivers}
                                                            opKey={"dni"}
                                                            opValue={"name"}
                                                            optionP={"dni"}
                                                            onSelect={handleSelectDriver}
                                                            value={inputModalData.driver_dni || ""}
                                                        />
                                                    </label>
                                                    <label>
                                                        Fecha:
                                                        <input
                                                            type="date"
                                                            name="date"
                                                            value={inputModalData.date}
                                                            onChange={handleChange}
                                                            className="input input-bordered w-full mt-1 bg-white text-black border-gray-300 placeholder-gray-500 dark:bg-boxdark dark:text-white dark:border-strokedark dark:placeholder-gray-400"
                                                        />
                                                    </label>
                                                    <label>
                                                        Hora de salida:
                                                        <input
                                                            type="time"
                                                            name="departure_time"
                                                            value={inputModalData.departure_time}
                                                            onChange={handleChange}
                                                            className="input input-bordered w-full mt-1 bg-white text-black border-gray-300 placeholder-gray-500 dark:bg-boxdark dark:text-white dark:border-strokedark dark:placeholder-gray-400"
                                                        />
                                                    </label>
                                                    <label>
                                                        Hora de llegada:
                                                        <input
                                                            type="time"
                                                            name="arrival_time"
                                                            value={inputModalData.arrival_time}
                                                            onChange={handleChange}
                                                            className="input input-bordered w-full mt-1 bg-white text-black border-gray-300 placeholder-gray-500 dark:bg-boxdark dark:text-white dark:border-strokedark dark:placeholder-gray-400"
                                                        />
                                                    </label>
                                                    <label>
                                                        Precio:
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            value={inputModalData.price}
                                                            onChange={handleChange}
                                                            className="input input-bordered w-full mt-1 bg-white text-black border-gray-300 placeholder-gray-500 dark:bg-boxdark dark:text-white dark:border-strokedark dark:placeholder-gray-400"
                                                        />
                                                    </label>
                                                </div>
                                            </EditPopup>
                                            {/* popup */}
                                            <DeletePopup
                                                id={freq.id}
                                                title="Eliminar Frecuencia"
                                                message="¿Estás seguro de que deseas eliminar esta frecuencia?"
                                                onConfirm={() => handleDelete(freq.id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FrequencyList;
