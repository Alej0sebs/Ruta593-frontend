import { useState } from 'react';
import { FaBus, FaHashtag, FaCar, FaCalendarAlt, FaTachometerAlt, FaFileUpload } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useBusStructure } from '../../hooks/useBusStructure';
import DataList from '../../components/DataList/datalist.components';
import useBusCreation from '../../hooks/useBusCreation';

// Datos locales de marcas y modelos
const BUS_BRANDS = [
  { id: 1, name: "Mercedes-Benz" },
  { id: 2, name: "Chevrolet" },
  { id: 3, name: "Hino" },
  { id: 4, name: "Hyundai" },
  { id: 5, name: "Volkswagen" },
];

const BUS_MODELS = [
  { id: 1, name: "OF 1721", brand_id: 1 },
  { id: 2, name: "OH 1621", brand_id: 1 },
  { id: 3, name: "NKR", brand_id: 2 },
  { id: 4, name: "NPR", brand_id: 2 },
  { id: 5, name: "AK", brand_id: 3 },
  { id: 6, name: "FC", brand_id: 3 },
  { id: 7, name: "County", brand_id: 4 },
  { id: 8, name: "Universe", brand_id: 4 },
  { id: 9, name: "17.230 OD", brand_id: 5 },
  { id: 10, name: "9.150 EOD", brand_id: 5 },
];

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

export function isValidEcuadorPlate(plate: string): boolean {
  // Elimina espacios y convierte a mayúsculas
  const clean = plate.trim().toUpperCase();

  // Formatos comunes:
  // - Particular: ABC-1234
  // - Comercial: ABC-123 (tres letras, tres números)
  // - Oficial: GOB-1234, POL-1234, etc.

  // RegEx: 3 letras, guion, 3 o 4 números
  const regex = /^[A-Z]{3}-\d{3,4}$/;

  // También acepta placas antiguas tipo: PAA-123, GAA-123, etc.
  return regex.test(clean);
}

const BusRegistration = () => {
  const { selectBusStructures } = useBusStructure();
  const { bus: createBus, loading } = useBusCreation();

  const [inputBus, setInputBus] = useState(initialStateBus);
  const [selectedBusStructure, setSelectedBusStructure] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [plateError, setPlateError] = useState('');
  const [capacityError, setCapacityError] = useState('');

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

  // Cuando cambia la marca, filtra los modelos y limpia el modelo seleccionado
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setInputBus({ ...inputBus, bus_manufacturer: brandId, model: '' });
    setFilteredModels(BUS_MODELS.filter((m) => m.brand_id.toString() === brandId));
  };

  // Cuando cambia el modelo, guarda el id como string
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputBus({ ...inputBus, model: e.target.value });
  };

  // Maneja el submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    setPlateError('');
    setCapacityError('');

    if (!imageFile) {
      setPlateError('Debes seleccionar una imagen');
      hasError = true;
    }
    if (!isValidEcuadorPlate(inputBus.license_plate)) {
      setPlateError('La placa ingresada no es válida para Ecuador. Ejemplo: PBC-1234');
      hasError = true;
    }
    if (Number(inputBus.capacity) > 90) {
      setCapacityError('La capacidad máxima permitida es 90');
      hasError = true;
    }
    if (hasError) return;

    const busData = {
      ...inputBus,
      year: Number(inputBus.year),
      capacity: Number(inputBus.capacity),
      bus_structure_id: Number(inputBus.bus_structure_id),
    };
    await createBus(busData, imageFile!);
    setInputBus(initialStateBus);
    setSelectedBusStructure('');
    setImageFile(null);
    setSelectedBrand('');
    setFilteredModels([]);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
      <Breadcrumb pageName="Registro de buses" />

      <div className="bg-gradient-to-br from-blue-300 via-blue-100 to-blue-50 rounded-2xl shadow-lg border border-blue-200 p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">Información del bus</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Número de unidad */}
          <div className="relative">
            <FaBus className="absolute left-4 top-3.5 text-blue-400" />
            <input
              type="text"
              name="bus_number"
              value={inputBus.bus_number}
              onChange={handleChange}
              placeholder="Número de la unidad"
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-blue-300 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Número de placa */}
          <div className="relative">
            <FaHashtag className="absolute left-4 top-3.5 text-blue-400" />
            <input
              type="text"
              name="license_plate"
              value={inputBus.license_plate}
              onChange={handleChange}
              placeholder="Número de placa"
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-blue-300 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {plateError && (
              <span className="text-red-500 text-sm absolute left-0 -bottom-5">{plateError}</span>
            )}
          </div>

          {/* Número de chasis */}
          <div className="relative">
            <FaHashtag className="absolute left-4 top-3.5 text-blue-400" />
            <input
              type="text"
              name="chassis_vin"
              value={inputBus.chassis_vin}
              onChange={handleChange}
              placeholder="Número de chasis"
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-blue-300 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Marca */}
          <div className="relative">
            <FaCar className="absolute left-4 top-3.5 text-blue-400" />
            <select
              name="bus_manufacturer"
              value={selectedBrand}
              onChange={handleBrandChange}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-blue-300 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">Seleccione una marca</option>
              {BUS_BRANDS.map((brand) => (
                <option key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Modelo */}
          <div className="relative">
            <FaCar className="absolute left-4 top-3.5 text-blue-400" />
            <select
              name="model"
              value={inputBus.model}
              onChange={handleModelChange}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-blue-300 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              disabled={!selectedBrand}
            >
              <option value="">Seleccione un modelo</option>
              {filteredModels.map((model) => (
                <option key={model.id} value={model.id.toString()}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* Año de fabricación */}
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-3.5 text-blue-400" />
            <select
              name="year"
              value={inputBus.year}
              onChange={handleChange}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-blue-300 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
            <FaTachometerAlt className="absolute left-4 top-3.5 text-blue-400" />
            <input
              type="number"
              name="capacity"
              value={inputBus.capacity}
              onChange={handleChange}
              placeholder="Capacidad"
              max={90} 
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-blue-300 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            {capacityError && (
              <span className="text-red-500 text-sm absolute left-0 -bottom-5">{capacityError}</span>
            )}
          </div>

          {/* Estructura del bus */}
          <div className="relative z-10">
            <label className="block mb-1 text-blue-900 font-semibold" htmlFor="bus_structure_id">
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
            <label className="block mb-2 text-blue-900 font-semibold">Subir imagen</label>
            <div className="flex items-center space-x-4">
              <FaFileUpload className="text-blue-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block text-sm text-blue-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-900 hover:file:bg-blue-300"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="rounded border border-blue-400 py-2 px-6 font-medium text-blue-700 bg-white hover:bg-blue-50 transition"
              onClick={() => {
                setInputBus(initialStateBus);
                setSelectedBusStructure('');
                setImageFile(null);
                setSelectedBrand('');
                setFilteredModels([]);
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-blue-700 py-2 px-6 font-medium text-white hover:bg-blue-800 transition"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusRegistration;
