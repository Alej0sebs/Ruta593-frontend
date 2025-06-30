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


{/* === Vincular estaciones === */}
<div className="bg-gradient-to-br from-blue-300 via-blue-100 to-blue-50 rounded-2xl shadow-lg border border-blue-200 p-8 mt-0 mb-8">
  <h3 className="text-xl font-bold text-blue-800 mb-6">Vincular Estaciones</h3>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSave();
    }}
  >
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-blue-900 font-semibold mb-1">
          Selecciona una estación
        </label>
        <div className="rounded-lg">
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
          />
        </div>
      </div>
    </div>

    {selectedStations.length > 0 && (
      <div className="mb-6">
        <h4 className="text-blue-900 font-semibold mb-2">Estaciones Seleccionadas</h4>
        <div className="bg-blue-50 rounded-xl shadow-inner p-6">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-sm text-left text-blue-900">
              <thead className="bg-blue-200 text-blue-800 uppercase text-sm">
                <tr>
                  <th className="px-6 py-3 font-bold">Nombre</th>
                  <th className="px-6 py-3 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {selectedStations.map((station) => (
                  <tr
                    key={station.id}
                    className="border-b border-blue-100 hover:bg-blue-100 transition"
                  >
                    <td className="px-6 py-4">{station.name}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
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
        type="button"
        onClick={handleCancel}
        className="rounded border border-blue-400 py-2 px-6 font-medium text-blue-700 bg-white hover:bg-blue-50 transition"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={saving}
        className="rounded bg-blue-700 py-2 px-6 font-medium text-white hover:bg-blue-800 transition"
      >
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  </form>
</div>

{/* === Estaciones vinculadas === */}
<div className="bg-gradient-to-br from-blue-300 via-blue-100 to-blue-50 rounded-2xl shadow-lg border border-blue-200 p-8 mb-8">
  <h3 className="text-2xl font-bold text-blue-800 mb-6">
    Estaciones Vinculadas
  </h3>
  <div className="rounded-xl shadow-inner p-6">
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full text-base text-left text-blue-900">
        <thead className="bg-blue-200 text-blue-900 uppercase text-base">
          <tr>
            <th className="px-4 py-2 font-bold">Nombre</th>
            <th className="px-4 py-2 font-bold">Ciudad</th>
          </tr>
        </thead>
        <tbody>
          {linkedStations.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-4 py-3 text-center text-blue-500 bg-white">
                No hay estaciones vinculadas.
              </td>
            </tr>
          ) : (
            linkedStations.map((station) => (
              <tr
                key={station.station_id}
                className="border-b border-blue-100 bg-white hover:bg-blue-100 transition"
              >
                <td className="px-4 py-3">{station.name}</td>
                <td className="px-4 py-3">{station.city_name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
    </div>
  );
};

export default LinkStations;
