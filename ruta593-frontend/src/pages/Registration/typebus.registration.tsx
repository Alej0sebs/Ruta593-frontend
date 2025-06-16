import { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import useBusLayout from '../../hooks/useBusLayout';
import { SeatConfigT } from '../../types';
import toast from 'react-hot-toast';
import SelectTypesComponent from './selectTypesComponent.registration';
import SvgSeatComponent from '../../components/busElements/svgSeats.components';
import SvgBathroomComponent from '../../components/busElements/svgBathroom.components';
import SvgStairsComponent from '../../components/busElements/svgStairs.components';
import BusTemplate from '../../components/Bus';
import { FaChair, FaTrash, FaSave } from 'react-icons/fa';
import { MdOutlineWc } from 'react-icons/md';
import { TbStairs } from 'react-icons/tb';

const TypebusRegistration = () => {
  const [busConfigurationName, setBusConfigurationName] = useState('');
  const [numFloors, setNumFloors] = useState(1);
  const [floorElements, setFloorElements] = useState<{ [key: number]: SeatConfigT[] }>({ 1: [] });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [seatName, setSeatName] = useState('');
  const [bathCounter, setBathCounter] = useState(1);
  const [stairsCounter, setStairsCounter] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const { loading, sendBusLayout } = useBusLayout();
  const [selectedSeatType, setSelectedSeatType] = useState<string>('');

  const handleSelectChange = (selectedvalue: string) => {
    setSelectedSeatType(selectedvalue);
  };

  const seatNameExists = (name: string) => {
    for (const floor in floorElements) {
      if (floorElements[floor].some(el => el.type === 'seat' && el.name.toLowerCase() === name.toLowerCase())) {
        return true;
      }
    }
    return false;
  };

  const addElement = (type: string) => {
    const busContainer = document.getElementById(`bus-container-${selectedFloor}`);
    const busRect = busContainer!.getBoundingClientRect();
    if (type === 'seat' && seatName === '') return;

    if (type === 'seat' && seatNameExists(seatName)) {
      toast.error(`El nombre del asiento "${seatName}" ya existe en otro piso.`);
      return;
    }

    let newElement = {
      id: '',
      type,
      name: '',
      position: { x: 10 / busRect.width * 100, y: 10 / busRect.height * 100 },
    };

    if (type === 'seat' && seatName) {
      if (selectedSeatType === '') return toast.error('Debes seleccionar un tipo de asiento');
      newElement.id = `seat-${selectedSeatType}-${seatName.toLowerCase()}`;
      newElement.name = selectedSeatType + seatName;
      setSeatName('');
    } else if (type === 'bathroom') {
      newElement.id = `bath-${bathCounter}`;
      setBathCounter(bathCounter + 1);
    } else if (type === 'stairs') {
      newElement.id = `stairs-${stairsCounter}`;
      setStairsCounter(stairsCounter + 1);
    }

    const idExistsInAnyFloor = Object.values(floorElements).some(elements =>
      elements.some(el => el.id === newElement.id)
    );

    if (!idExistsInAnyFloor) {
      setFloorElements(prevState => ({
        ...prevState,
        [selectedFloor]: [...(prevState[selectedFloor] || []), newElement],
      }));
    } else {
      toast.error(`El ID "${newElement.id}" ya existe en otro piso. Usa otro nombre.`);
    }
  };

  const removeSelectedElement = () => {
    if (selectedElement !== null) {
      const updatedElements = floorElements[selectedFloor].filter((el) => el.id !== selectedElement);
      setFloorElements({
        ...floorElements,
        [selectedFloor]: updatedElements,
      });
      setSelectedElement(null);
    }
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNumFloors = parseInt(e.target.value, 10);
    setNumFloors(newNumFloors);
    if (newNumFloors === 2 && !floorElements[2]) {
      setFloorElements({ ...floorElements, 2: [] });
    }
  };

  useEffect(() => {
    const handleDrag = (e: MouseEvent, id: string) => {
      const element = document.getElementById(id);
      const busContainer = document.getElementById(`bus-container-${selectedFloor}`);
      const busRect = busContainer!.getBoundingClientRect();
      const elementRect = element!.getBoundingClientRect();

      let shiftX = e.clientX - elementRect.left;
      let shiftY = e.clientY - elementRect.top;

      const onMouseMove = (event: MouseEvent) => {
        let newLeft = (event.clientX - busRect.left - shiftX) / busRect.width * 100;
        let newTop = (event.clientY - busRect.top - shiftY) / busRect.height * 100;

        const elementWidth = (elementRect.width / busRect.width) * 100;
        const elementHeight = (elementRect.height / busRect.height) * 100;

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft > 100 - elementWidth) newLeft = 100 - elementWidth;
        if (newTop > 100 - elementHeight) newTop = 100 - elementHeight;

        const updatedElements = floorElements[selectedFloor].map(el =>
          el.id === id ? { ...el, position: { x: newLeft, y: newTop } } : el
        );
        setFloorElements({ ...floorElements, [selectedFloor]: updatedElements });
      };

      document.addEventListener('mousemove', onMouseMove);
      document.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
      };
    };

    floorElements[selectedFloor]?.forEach((el) => {
      const element = document.getElementById(el.id);
      if (element) {
        element.onmousedown = (e) => {
          setSelectedElement(el.id);
          handleDrag(e as any, el.id);
        };
        element.ondragstart = () => false;
      }
    });
  }, [floorElements, selectedFloor]);

  useEffect(() => {
    floorElements[selectedFloor]?.forEach((el) => {
      const element = document.getElementById(el.id);
      if (element) {
        const busContainer = document.getElementById(`bus-container-${selectedFloor}`);
        const busRect = busContainer!.getBoundingClientRect();

        const absoluteLeft = (el.position.x / 100) * busRect.width;
        const absoluteTop = (el.position.y / 100) * busRect.height;

        element.style.left = `${absoluteLeft}px`;
        element.style.top = `${absoluteTop}px`;
      }
    });
  }, [selectedFloor, floorElements]);

  const saveSeatsConfiguration = () => {
    if (!busConfigurationName) return toast.error('Debes asignar un nombre al bus.');
    if (floorElements[1].length === 0) return toast.error('El primer piso debe tener al menos un elemento.');

    const cooperative = localStorage.getItem('ruta593-log') || '{}';
    sendBusLayout({
      id: 0,
      name: busConfigurationName,
      cooperative_id: JSON.parse(cooperative).cooperative,
      layout: floorElements,
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
      <Breadcrumb pageName="Registro Estructura De Bus" />
      <div className="bg-[#FEDD00] rounded-xl shadow-xl p-6 mt-6">
        <div className="bg-[#0F1A2F] rounded-xl p-4">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-[#0F1A2F] rounded-xl shadow-inner p-6">
          <h3 className="text-xl font-bold text-[#0F1A2F] bg-[#FEDD00] p-2 rounded-md w-fit mb-6">
            Estructura del Bus
          </h3>
            {/* BUS + PANEL */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center w-full">
              <div id={`bus-container-${selectedFloor}`} className="relative w-[600px] h-[300px] border-4 border-gray-700 rounded-2xl bg-gradient-to-b from-gray-300 to-gray-100 shadow-lg">
                <BusTemplate floorNumber={selectedFloor} horizontal>
                  {floorElements[selectedFloor]?.map((element) => {
                    const busContainer = document.getElementById(`bus-container-${selectedFloor}`);
                    const busRect = busContainer!.getBoundingClientRect();
                    const absoluteLeft = (element.position.x / 100) * busRect.width;
                    const absoluteTop = (element.position.y / 100) * busRect.height;

                    return (
                      <div
                        key={element.id}
                        id={element.id}
                        className={`absolute cursor-grab ${selectedElement === element.id}`}
                        style={{ left: `${absoluteLeft}px`, top: `${absoluteTop}px` }}
                      >
                        {element.type === 'seat' && <SvgSeatComponent name={element.name} isSelected={selectedElement === element.id} status='f' />}
                        {element.type === 'bathroom' && <MdOutlineWc size={24} className="text-purple-600" />}
                        {element.type === 'stairs' && <TbStairs size={24} className="text-orange-500" />}
                      </div>
                    );
                  })}
                </BusTemplate>
              </div>

              <div className="bg-[#172B4D] p-6 rounded-xl shadow-xl flex flex-col items-center w-full max-w-sm">
                <h2 className="text-white text-lg font-semibold mb-4">Agregar Elementos</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => addElement('seat')} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full">
                    <FaChair size={20} />
                  </button>
                  <button onClick={() => addElement('bathroom')} className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full">
                    <MdOutlineWc size={20} />
                  </button>
                  <button onClick={() => addElement('stairs')} className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full">
                    <TbStairs size={20} />
                  </button>
                  <button
                    onClick={removeSelectedElement}
                    disabled={selectedElement === null}
                    className={`bg-red-600 hover:bg-red-700 text-white p-3 rounded-full ${selectedElement === null ? 'opacity-50' : ''}`}
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
                <button
                  onClick={saveSeatsConfiguration}
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <FaSave /> Guardar
                </button>
              </div>
            </div>

            {/* CONTROLES FINALES */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-7 w-full max-w-6xl">
              <input
                type="text"
                placeholder="Nombre del bus"
                value={busConfigurationName}
                onChange={(e) => setBusConfigurationName(e.target.value)}
                className="col-span-2 p-3 rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <select
                value={numFloors}
                onChange={handleFloorChange}
                disabled={floorElements[1].length > 0}
                className="p-3 rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value={1}>1 Piso</option>
                <option value={2}>2 Pisos</option>
              </select>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(parseInt(e.target.value, 10))}
                className="p-3 rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {Array.from({ length: numFloors }, (_, i) => i + 1).map(floor => (
                  <option key={floor} value={floor}>Piso {floor}</option>
                ))}
              </select>
              <SelectTypesComponent onSelectChange={handleSelectChange} />
              <input
                type="text"
                placeholder="Número de asiento"
                value={seatName}
                onChange={(e) => setSeatName(e.target.value)}
                className="p-3 rounded-md bg-[#172B4D] text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TypebusRegistration;
