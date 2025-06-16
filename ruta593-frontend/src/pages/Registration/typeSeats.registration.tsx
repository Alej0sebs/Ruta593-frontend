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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormTypeSeats({
      ...formTypeSeats,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSeatType(formTypeSeats);
    setFormTypeSeats(initialStateTypeSeats);
    reloadSeatTypes();
  };

  const handleCancelBtn = () => {
    setFormTypeSeats(initialStateTypeSeats);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
      <Breadcrumb pageName="Registro de Asientos" />

      {/* === FORMULARIO DE TIPO DE ASIENTO === */}
      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6 mb-8">
        <div className="bg-[#0F1A2F] rounded-xl shadow-inner p-6">
          <h3 className="text-xl font-bold text-[#0F1A2F] bg-[#FEDD00] p-4 rounded-md w-fit mb-6">
            Información del tipo de asiento
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Nombre */}
              <div>
                <label className="block mb-1 text-white font-medium">Nombre del Asiento</label>
                <input
                  type="text"
                  name="name"
                  value={formTypeSeats.name}
                  onChange={handleChange}
                  placeholder="VIP"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block mb-1 text-white font-medium">Descripción</label>
                <input
                  type="text"
                  name="description"
                  value={formTypeSeats.description}
                  onChange={handleChange}
                  placeholder="Asiento VIP"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Carácter Especial */}
              <div>
                <label className="block mb-1 text-white font-medium">Carácter Especial</label>
                <input
                  type="text"
                  name="special_caracter"
                  value={formTypeSeats.special_caracter}
                  onChange={handleChange}
                  placeholder="V"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 bg-[#172B4D] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Costo Adicional */}
              <div>
                <label className="block mb-1 text-white font-medium">Costo Adicional</label>
                <input
                  type="number"
                  name="additional_cost"
                  value={formTypeSeats.additional_cost}
                  onChange={handleChange}
                  placeholder="2.00"
                  step="0.01"
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
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* === TABLA === */}
      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6">
        <div className="bg-[#0F1A2F] rounded-xl p-4">
          <h3 className="text-xl font-bold text-white mb-4">Tipos de Asiento Registrados</h3>
          <TableAux
            headerTable={['id', 'name', 'special_caracter', 'description', 'additional_cost']}
            displayHeader={['ID', 'TIPO DE ASIENTO', 'CARÁCTER', 'DESCRIPCIÓN', 'COSTO ADICIONAL']}
          >
            {selectSeatTypes}
          </TableAux>
        </div>
      </div>
    </div>
  );
};

export default TypeSeats;
