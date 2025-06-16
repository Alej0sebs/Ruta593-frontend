import { useState, useEffect } from 'react';
import useBusStations from '../../hooks/useBusStations';
import useLinkCooperativeStation from '../../hooks/useLinkCooperativeStation';
import toast from 'react-hot-toast';
import { HiX } from 'react-icons/hi';
import DataList from '../../components/DataList/datalist.components';
import { LinkCooperativesT } from '../../types';
import TableLinkedStations from '../../components/Tables/TableLinkedStations';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'; // ✅ Agregado

const LinkStations = () => {
  const [selectedStations, setSelectedStations] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itWasSaved, setItWasSaved] = useState(false);

  const { allBusStations, loading: stationsLoading } = useBusStations();
  const {
    linkStation,
    getLinkedStations,
    loading: saving,
  } = useLinkCooperativeStation();
  const [linkedStations, setLinkedStations] = useState<LinkCooperativesT[]>([]);

  const fetchLinkedStations = async (page: number) => {
    try {
      const result = await getLinkedStations(page);
      setTotalPages(result.totalPages);
      const auxStationList = result.list.map((station: any) => ({
        station_id: station.id,
        cooperative_id: station.cooperative_id,
        city_name: station.city_bus_station.name,
        name: station.name
      }));
      setLinkedStations(auxStationList);
    } catch (error) {
      toast.error('Error al obtener las estaciones vinculadas.');
    }
  };

  useEffect(() => {
    fetchLinkedStations(currentPage);
  }, [currentPage, itWasSaved]);

  const handleStationSelection = (stationId: string) => {
    const selectedStation = allBusStations.find((station) => station.id === stationId);
    if (selectedStation) {
      setSelectedStations((prev) =>
        prev.includes(selectedStation)
          ? prev.filter((s) => s.id !== stationId)
          : [...prev, selectedStation]
      );
    }
  };

  const handleRemoveStation = (stationId: string) => {
    setSelectedStations((prev) => prev.filter((s) => s.id !== stationId));
  };

  const handleSave = async () => {
    try {
      if (selectedStations.length === 0) {
        toast.error('Por favor, selecciona al menos una estación.');
        return;
      }
      for (const station of selectedStations) {
        await linkStation(station.id);
      }
      setItWasSaved(!itWasSaved);
      setSelectedStations([]);
    } catch (error) {
      toast.error('Error al guardar las estaciones.');
    }
  };

  const handleCancel = () => {
    setSelectedStations([]);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
      <Breadcrumb pageName="Vincular Estaciones" /> {/* ✅ Breadcrumb con título */}

      {/* === Estaciones vinculadas === */}
      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6 mb-8">
        <div className="bg-[#0F1A2F] rounded-xl shadow-inner p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            Estaciones Vinculadas
          </h3>
          <TableLinkedStations data={linkedStations} />
        </div>
      </div>

      {/* === Enlazar rutas === */}
      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6">
        <div className="bg-[#0F1A2F] rounded-xl p-6">
          <h3 className="bg-[#FEDD00] text-[#0F1A2F] font-bold text-lg rounded-md inline-block px-4 py-2 mb-6">
            Enlazar Rutas
          </h3>

          {stationsLoading ? (
            <p className="text-white">Cargando estaciones...</p>
          ) : (
            <div className="mb-6">
              <label className="block mb-2 text-white font-medium">
                Selecciona una estación:
              </label>
              <div className="rounded-md">
                <DataList
                  id="station-selector"
                  label=""
                  options={allBusStations}
                  placeholder="Escribe para buscar..."
                  onSelect={handleStationSelection}
                  value={selectedStations.map((station) => station.name).join(', ')}
                  opKey="id"
                  opValue="name"
                  optionP="name"
                  inputClassName="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          )}

          {selectedStations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-2">Estaciones Seleccionadas</h4>
              <div className="bg-[#0F1A2F] rounded-xl shadow-xl p-6">
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full text-sm text-left text-white">
                    <thead className="bg-[#FEDD00] text-[#0F1A2F] uppercase text-sm">
                      <tr>
                        <th className="px-6 py-3 font-bold">Nombre</th>
                        <th className="px-6 py-3 font-bold text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStations.map((station) => (
                        <tr
                          key={station.id}
                          className="border-b border-gray-600 hover:bg-[#172B4D] transition"
                        >
                          <td className="px-6 py-4">{station.name}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleRemoveStation(station.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <HiX size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCancel}
              className="bg-white border border-black text-black py-2 px-6 rounded-md font-medium hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#FEDD00] text-[#0F1A2F] py-2 px-6 rounded-md font-medium hover:opacity-90 transition"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkStations;
