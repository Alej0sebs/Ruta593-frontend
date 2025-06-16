import { FaBus, FaHashtag, FaCar, FaCalendarAlt, FaTachometerAlt, FaFileUpload } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useState } from 'react';
import { useBusStructure } from '../../hooks/useBusStructure';
import DataList from '../../components/DataList/datalist.components';
import useBusCreation from '../../hooks/useBusCreation';

const initialStateBus = {
  bus_number: '',
  license_plate: '',
  chassis_vin: '',
  bus_manufacturer: '',
  model: '',
  year: '',
  capacity: '',
  bus_structure_id: '',
};

const BusRegistration = () => {
  const { selectBusStructures } = useBusStructure();
  const { bus: createBus, loading } = useBusCreation();

  const [inputBus, setInputBus] = useState(initialStateBus);
  const [selectedBusStructure, setSelectedBusStructure] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Maneja cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputBus({
      ...inputBus,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja selección de estructura
  const handleStructureSelect = (value: string) => {
    setSelectedBusStructure(value);
    setInputBus({ ...inputBus, bus_structure_id: value });
  };

  // Maneja selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Maneja el submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Debes seleccionar una imagen');
      return;
    }
    // Asegúrate de convertir los campos numéricos
    const busData = {
      ...inputBus,
      year: Number(inputBus.year),
      capacity: Number(inputBus.capacity),
      bus_structure_id: Number(inputBus.bus_structure_id),
    };
    await createBus(busData, imageFile);
    // Limpia el formulario si quieres
    setInputBus(initialStateBus);
    setSelectedBusStructure('');
    setImageFile(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
      <Breadcrumb pageName="Registro de buses" />

      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6 mt-8">
        <div className="bg-[#0F1A2F] rounded-xl p-10">
          <h3 className="bg-[#FEDD00] text-[#0F1A2F] font-bold text-lg rounded-md inline-block px-4 py-2 mb-6">
            Información del bus
          </h3>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {/* Número de unidad */}
            <div className="relative">
              <FaBus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="text"
                name="bus_number"
                value={inputBus.bus_number}
                onChange={handleChange}
                placeholder="Número de la unidad"
                className="pl-10 pr-4 py-3 w-full rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Número de placa */}
            <div className="relative">
              <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="text"
                name="license_plate"
                value={inputBus.license_plate}
                onChange={handleChange}
                placeholder="Número de placa"
                className="pl-10 pr-4 py-3 w-full rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Número de chasis */}
            <div className="relative">
              <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="text"
                name="chassis_vin"
                value={inputBus.chassis_vin}
                onChange={handleChange}
                placeholder="Número de chasis"
                className="pl-10 pr-4 py-3 w-full rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Marca */}
            <div className="relative">
              <FaCar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="text"
                name="bus_manufacturer"
                value={inputBus.bus_manufacturer}
                onChange={handleChange}
                placeholder="Marca"
                className="pl-10 pr-4 py-3 w-full rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Modelo */}
            <div className="relative">
              <FaCar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="text"
                name="model"
                value={inputBus.model}
                onChange={handleChange}
                placeholder="Modelo"
                className="pl-10 pr-4 py-3 w-full rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Año de fabricación */}
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <select
                name="year"
                value={inputBus.year}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 w-full rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Seleccione un año</option>
                {Array.from({ length: 25 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Capacidad */}
            <div className="relative">
              <FaTachometerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="number"
                name="capacity"
                value={inputBus.capacity}
                onChange={handleChange}
                placeholder="Capacidad"
                className="pl-10 pr-4 py-3 w-full rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Estructura del bus - LABEL MANUAL Y DATALIST */}
            <div className="relative z-10">
              <label className="block mb-1 text-white font-medium" htmlFor="bus_structure_id">
                Estructura del bus
              </label>
              <DataList
                id="bus_structure_id"
                label=""
                placeholder="Seleccione o busque una estructura"
                options={selectBusStructures}
                value={selectedBusStructure}
                onSelect={handleStructureSelect}
                iconP={FaBus}
                opKey="id"
                opValue="name"
                optionP="name"
              />
            </div>

            {/* Subir imagen */}
            <div className="col-span-2">
              <label className="block mb-2 text-white font-medium">Subir imagen</label>
              <div className="flex items-center space-x-4">
                <FaFileUpload className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FEDD00] file:text-[#0F1A2F] hover:file:bg-yellow-500"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="col-span-2 flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="bg-white text-[#0F1A2F] py-2 px-6 rounded-md font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#FEDD00] text-[#0F1A2F] py-2 px-6 rounded-md font-medium hover:brightness-110 transition"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusRegistration;
