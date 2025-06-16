import { FaCity, FaPhoneAlt } from 'react-icons/fa';
import { MdLocationOn, MdAccessTime } from 'react-icons/md';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { createBusStationT } from '../../types';
import createBusStation from '../../hooks/usebusStationRegistration';
import { useState } from 'react';
import { useCity } from '../../hooks/useCity';
import DataList from '../../components/DataList/datalist.components';

const initialStateBusStation: createBusStationT = {
  city_id: '',
  name: '',
  address: '',
  phone: '',
  open_time: '',
  close_time: '',
};

const BusStationRegistration: React.FC = () => {
  const { loading: loadingBusStation, station } = createBusStation();
  const [inputBusStation, setInputBusStation] = useState<createBusStationT>(initialStateBusStation);
  const { selectCity } = useCity();
  const [selectedCity, setSelectCity] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setInputBusStation({
      ...inputBusStation,
      [name]: name === 'year' || name === 'capacity' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await station(inputBusStation);
  };

  const handleCancel = () => {
    setInputBusStation(initialStateBusStation);
    setSelectCity('');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
      <Breadcrumb pageName="Registro de Terminales" className="text-gray" />

      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6 max-w-8xl mx-auto">
        <div className="bg-[#0F1A2F] rounded-xl shadow-inner p-6">
          <h3 className="text-xl font-bold text-[#0F1A2F] bg-[#FEDD00] p-4 rounded-md w-fit mb-6">Información del Terminal</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ciudad */}
              <div>
                <label className="block mb-1 text-white font-medium">Ciudad</label>
                <DataList
                  id="city_id"
                  label=""
                  placeholder="Seleccione o busque una ciudad"
                  options={selectCity}
                  value={selectedCity}
                  onSelect={(value) => {
                    setSelectCity(value);
                    setInputBusStation({ ...inputBusStation, city_id: value });
                  }}
                  iconP={FaCity}
                  opKey="id"
                  opValue="name"
                  optionP="name"
                  inputClassName="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                />
              </div>

              {/* Nombre del terminal */}
              <div>
                <label className="block mb-1 text-white font-medium">Nombre del Terminal</label>
                <div className="relative">
                  <span className="absolute left-4.5 top-3.5 text-white"><FaCity /></span>
                  <input
                    className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                    type="text"
                    name="name"
                    placeholder="Nombre del Terminal"
                    value={inputBusStation.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="mb-6">
              <label className="block mb-1 text-white font-medium">Dirección</label>
              <div className="relative">
                <span className="absolute left-4.5 top-3.5 text-white"><MdLocationOn /></span>
                <input
                  className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                  type="text"
                  name="address"
                  maxLength={80}
                  placeholder="Dirección"
                  value={inputBusStation.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="mb-6">
              <label className="block mb-1 text-white font-medium">Teléfono</label>
              <div className="relative">
                <span className="absolute left-4.5 top-3.5 text-white"><FaPhoneAlt /></span>
                <input
                  className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                  type="text"
                  name="phone"
                  maxLength={14}
                  placeholder="+593 x xxx xxxx"
                  value={inputBusStation.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Horarios */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-white font-medium">Hora de Apertura</label>
                <div className="relative">
                  <span className="absolute left-4.5 top-3.5 text-white"><MdAccessTime /></span>
                  <input
                    className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                    type="time"
                    name="open_time"
                    value={inputBusStation.open_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-white font-medium">Hora de Cierre</label>
                <div className="relative">
                  <span className="absolute left-4.5 top-3.5 text-white"><MdAccessTime /></span>
                  <input
                    className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                    type="time"
                    name="close_time"
                    value={inputBusStation.close_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white border border-black text-black py-2 px-6 rounded-md font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loadingBusStation}
                className="bg-[#FEDD00] text-[#0F1A2F] py-2 px-6 rounded-md font-bold hover:brightness-110 transition"
              >
                {loadingBusStation ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusStationRegistration;
