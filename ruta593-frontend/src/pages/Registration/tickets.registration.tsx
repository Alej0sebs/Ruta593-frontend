import React, { useState, useEffect } from 'react';
import DataList from '../../components/DataList/datalist.components';
import { useSeller } from '../../hooks/useSeller';
import { TicketsListT } from '../../types';
import useBusStations from '../../hooks/useBusStations';
import toast from 'react-hot-toast';
import useSerialStation from '../../hooks/useSerialStation';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const TicketSeriesRegistration = () => {
  const { loading: loadingSellers, selectSeller } = useSeller();
  const { loading: loadingStations, dataListBusStations } = useBusStations();
  const { loading, createSerialStation, getSerialStation } = useSerialStation();

  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState('');
  const [serial_number, setSerie] = useState<string>('');
  const [serialStations, setSerialStations] = useState<TicketsListT[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSelectSede = (stationId: string) => setSelectedStation(stationId);
  const handleSelectSeller = (sellerId: string) => setSelectedSeller(sellerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeller || !selectedStation || !serial_number) {
      toast.error('Por favor complete todos los campos.');
      return;
    }

    const SerialStationData: TicketsListT = {
      station_id: selectedStation,
      user_id: selectedSeller,
      serial_number,
      status: 'true',
    };

    try {
      await createSerialStation(SerialStationData);
      toast.success('Serie registrada correctamente');
      handleCancelBtn();
      fetchSerialStations();
    } catch (error) {
      console.error('Error al guardar la serie:', error);
    }
  };

  const handleCancelBtn = () => {
    setSelectedSeller(null);
    setSelectedStation('');
    setSerie('');
  };

  const fetchSerialStations = async (page: number = 1) => {
    try {
      const response = await getSerialStation(page);
      const data = response.list;
      if (Array.isArray(data)) {
        const formattedData = data.map((item: any) => ({
          serial_number: item.serial_number,
          station_name: item.BusStation.name,
          user_name: `${item.User.name} ${item.User.last_name}`,
          station_id: item.BusStation.id,
          user_id: item.User.dni,
          status: 'active',
        }));
        setSerialStations(formattedData);
        setTotalPages(response.totalPages);
      } else {
        throw new Error('Estructura de datos inesperada');
      }
    } catch (error) {
      console.error('Error al obtener las series:', error);
    }
  };

  useEffect(() => {
    fetchSerialStations(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
      <Breadcrumb pageName="Registro de tickets" className="text-gray" />

      {/* === FORMULARIO === */}
      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6 mb-8">
        <div className="bg-[#0F1A2F] rounded-xl shadow-inner p-6">
          <h3 className="text-xl font-bold text-[#0F1A2F] bg-[#FEDD00] p-4 rounded-md w-fit mb-6">
            Información del ticket
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Vendedor */}
              <div>
                <label className="block mb-1 text-white font-medium">Vendedor</label>
                {loadingSellers ? (
                  <p className="text-white">Cargando vendedores...</p>
                ) : (
                  <DataList
                    id="seller"
                    label=""
                    options={selectSeller.map((seller) => ({
                      ...seller,
                      full_name: `${seller.name} ${seller.last_name}`,
                    }))}
                    placeholder="Seleccione un vendedor"
                    onSelect={handleSelectSeller}
                    value={selectedSeller || ''}
                    opKey="dni"
                    opValue="full_name"
                    optionP="full_name"
                    inputClassName="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )}
              </div>

              {/* Sede */}
              <div>
                <label className="block mb-1 text-white font-medium">Sede</label>
                {loadingStations ? (
                  <p className="text-white">Cargando sedes...</p>
                ) : (
                  <DataList
                    id="sede"
                    label=""
                    options={dataListBusStations}
                    placeholder="Seleccione una sede"
                    onSelect={handleSelectSede}
                    value={selectedStation || ''}
                    opKey="id"
                    opValue="name"
                    optionP="name"
                    inputClassName="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                )}
              </div>

              {/* Número de serie */}
              <div>
                <label className="block mb-1 text-white font-medium">Número de Serie</label>
                <input
                  type="text"
                  value={serial_number}
                  onChange={(e) => setSerie(e.target.value)}
                  placeholder="Ingrese el número de serie"
                  maxLength={5}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancelBtn}
                className="bg-white border border-black text-black py-2 px-6 rounded-md font-medium hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#FEDD00] text-[#0F1A2F] py-2 px-6 rounded-md font-bold hover:brightness-110 transition"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* === TABLA === */}
      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6">
        <div className="bg-[#0F1A2F] rounded-xl shadow-inner p-6">
          <h3 className="text-xl font-bold text-white mb-6">Series de Boletos Registradas</h3>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-sm text-left text-white">
              <thead className="bg-[#FEDD00] text-[#0F1A2F] uppercase text-sm">
                <tr>
                  <th className="px-6 py-3 font-bold">Sede</th>
                  <th className="px-6 py-3 font-bold">Vendedor</th>
                  <th className="px-6 py-3 font-bold">Número de Serie</th>
                </tr>
              </thead>
              <tbody>
                {serialStations.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-white">
                      No hay datos disponibles.
                    </td>
                  </tr>
                ) : (
                  serialStations.map((station, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-600 hover:bg-[#172B4D] transition"
                    >
                      <td className="px-6 py-4">{station.station_name}</td>
                      <td className="px-6 py-4">{station.user_name}</td>
                      <td className="px-6 py-4">{station.serial_number}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="bg-white text-black py-1 px-4 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => {
                const prev = currentPage - 1;
                setCurrentPage(prev);
                fetchSerialStations(prev);
              }}
            >
              Anterior
            </button>
            <span className="text-white">
              Página {currentPage} de {totalPages || 1}
            </span>
            <button
              className="bg-white text-black py-1 px-4 rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => {
                const next = currentPage + 1;
                setCurrentPage(next);
                fetchSerialStations(next);
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSeriesRegistration;
