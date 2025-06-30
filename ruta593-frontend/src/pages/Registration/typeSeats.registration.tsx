import useTypeSeats from '../../hooks/useTypeSeats';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableAux from '../../components/Tables/TableAux';
import { SeatType } from '../../types';
import { useState } from 'react';

const initialStateTypeSeats: SeatType = {
  id: '',
  name: '',
  description: '',
  special_caracter: '',
  additional_cost: 0,
};

const TypeSeats = () => {
  const { selectSeatTypes, createSeatType, reloadSeatTypes } = useTypeSeats();
  const [formTypeSeats, setFormTypeSeats] = useState<SeatType>(initialStateTypeSeats);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<React.FormEvent | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormTypeSeats({
      ...formTypeSeats,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingSubmit(e);
    setShowConfirm(true);
  };

  const handleCancelBtn = () => {
    setFormTypeSeats(initialStateTypeSeats);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    if (pendingSubmit) {
      await createSeatType(formTypeSeats);
      setFormTypeSeats(initialStateTypeSeats);
      reloadSeatTypes();
      setPendingSubmit(null);
    }
  };

  const getSeatTypeSummary = (seat: SeatType) => (
    <>
      <p className="mb-2"><span className="font-semibold">Nombre:</span> {seat.name}</p>
      <p className="mb-2"><span className="font-semibold">Descripción:</span> {seat.description}</p>
      <p className="mb-2"><span className="font-semibold">Carácter Especial:</span> {seat.special_caracter}</p>
      <p><span className="font-semibold">Porcentaje Adicional:</span> {seat.additional_cost}%</p>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
      <Breadcrumb pageName="Registro de Asientos" />

      {/* === FORMULARIO DE TIPO DE ASIENTO === */}
      <div className="bg-gradient-to-br from-blue-300 via-blue-100 to-blue-50 rounded-2xl shadow-lg border border-blue-200 p-8 mb-8 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">
          Información del tipo de asiento
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Nombre */}
            <div>
              <label className="block mb-1 text-blue-900 font-semibold">Nombre del Asiento</label>
              <input
                type="text"
                name="name"
                value={formTypeSeats.name}
                onChange={handleChange}
                placeholder="VIP"
                className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block mb-1 text-blue-900 font-semibold">Descripción</label>
              <input
                type="text"
                name="description"
                value={formTypeSeats.description}
                onChange={handleChange}
                placeholder="Asiento VIP"
                className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Carácter Especial */}
            <div>
              <label className="block mb-1 text-blue-900 font-semibold">Carácter Especial</label>
              <input
                type="text"
                name="special_caracter"
                value={formTypeSeats.special_caracter}
                onChange={handleChange}
                placeholder="V"
                className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Costo Adicional */}
            <div>
              <label className="block mb-1 text-blue-900 font-semibold">Porcentaje Adicional (%)</label>
              <div className="relative">
                <input
                  type="number"
                  name="additional_cost"
                  value={formTypeSeats.additional_cost}
                  onChange={handleChange}
                  placeholder="Ej: 10"
                  min={0}
                  max={100}
                  step="0.01"
                  className="w-full rounded-lg border border-blue-300 bg-white py-3 px-4 pr-10 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <span className="absolute right-4 top-3.5 text-blue-400 font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancelBtn}
              className="rounded border border-blue-400 py-2 px-6 font-medium text-blue-700 bg-white hover:bg-blue-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-blue-700 py-2 px-6 font-medium text-white hover:bg-blue-800 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      {/* === TABLA === */}
      <div className="bg-gradient-to-br from-blue-300 via-blue-100 to-blue-50 rounded-2xl shadow-lg border border-blue-200 p-8 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">Tipos de Asiento Registrados</h3>
        <div className="rounded-xl shadow-inner p-6">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-base text-left text-blue-900">
              <thead className="bg-blue-200 text-blue-900 uppercase text-base">
                <tr>
                  <th className="px-4 py-2 font-bold">ID</th>
                  <th className="px-4 py-2 font-bold">Tipo de Asiento</th>
                  <th className="px-4 py-2 font-bold">Carácter</th>
                  <th className="px-4 py-2 font-bold">Descripción</th>
                  <th className="px-4 py-2 font-bold">Costo Adicional</th>
                </tr>
              </thead>
              <tbody>
                {selectSeatTypes && selectSeatTypes.length > 0 ? (
                  selectSeatTypes.map((seat: SeatType) => (
                    <tr
                      key={seat.id}
                      className="border-b border-blue-100 bg-white hover:bg-blue-100 transition"
                    >
                      <td className="px-4 py-3">{seat.id}</td>
                      <td className="px-4 py-3">{seat.name}</td>
                      <td className="px-4 py-3">{seat.special_caracter}</td>
                      <td className="px-4 py-3">{seat.description}</td>
                      <td className="px-4 py-3">{seat.additional_cost}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-blue-500 bg-white">
                      No hay tipos de asiento registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* === CONFIRMACION === */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full border border-blue-200">
            <h4 className="text-lg font-bold text-blue-800 mb-4">Confirmar registro</h4>
            <div className="mb-4 text-blue-900">
              {getSeatTypeSummary(formTypeSeats)}
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded border border-blue-400 py-2 px-6 font-medium text-blue-700 bg-white hover:bg-blue-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSave}
                className="rounded bg-blue-700 py-2 px-6 font-medium text-white hover:bg-blue-800 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeSeats;
