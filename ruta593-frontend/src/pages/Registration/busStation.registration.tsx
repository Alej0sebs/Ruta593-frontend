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
      <Breadcrumb pageName="Registro de Terminales" />

      <div className="bg-gradient-to-br from-blue-300 via-blue-100 to-blue-50 rounded-2xl shadow-lg border border-blue-200 p-8 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">Información del Terminal</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ciudad */}
            <div>
              <label className="block mb-1 text-blue-900 font-semibold">Ciudad</label>
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
                
              />
            </div>

            {/* Nombre del terminal */}
            <div>
              <label className="block mb-1 text-blue-900 font-semibold">Nombre del Terminal</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-blue-400"><FaCity /></span>
                <input
                  className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 pl-10 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
            <label className="block mb-1 text-blue-900 font-semibold">Dirección</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-blue-400"><MdLocationOn /></span>
              <input
                className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 pl-10 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
            <label className="block mb-1 text-blue-900 font-semibold">Teléfono</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-blue-400"><FaPhoneAlt /></span>
              <input
                className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 pl-10 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              <label className="block mb-1 text-blue-900 font-semibold">Hora de Apertura</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-blue-400"><MdAccessTime /></span>
                <input
                  className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 pl-10 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  type="time"
                  name="open_time"
                  value={inputBusStation.open_time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-blue-900 font-semibold">Hora de Cierre</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-blue-400"><MdAccessTime /></span>
                <input
                  className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 pl-10 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="rounded border border-blue-400 py-2 px-6 font-medium text-blue-700 bg-white hover:bg-blue-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loadingBusStation}
              className="rounded bg-blue-700 py-2 px-6 font-medium text-white hover:bg-blue-800 transition"
            >
              {loadingBusStation ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusStationRegistration;
