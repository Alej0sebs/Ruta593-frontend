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
import { FaTrash, FaSave } from 'react-icons/fa';
import { MdOutlineWc } from 'react-icons/md';
import { TbStairs } from 'react-icons/tb';

const TypebusRegistration = () => {
  const [busConfigurationName, setBusConfigurationName] = useState('');
  const [numFloors, setNumFloors] = useState(1);
  const [floorElements, setFloorElements] = useState<{ [key: number]: SeatConfigT[] }>({ 1: [] });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [seatCounters, setSeatCounters] = useState<{ [type: string]: number }>({});
  const [bathCounter, setBathCounter] = useState(1);
  const [stairsCounter, setStairsCounter] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const { loading, sendBusLayout } = useBusLayout();
  const [selectedSeatType, setSelectedSeatType] = useState<string>('');

  const handleSelectChange = (selectedvalue: string) => {
    setSelectedSeatType(selectedvalue);
  };

  const addElement = (type: string) => {
    const busContainer = document.getElementById(`bus-container-${selectedFloor}`);
    if (!busContainer) return;
    const busRect = busContainer.getBoundingClientRect();

    let newElement = {
      id: '',
      type,
      name: '',
      position: { x: 5, y: 5 },
    };

    if (type === 'seat') {
      if (selectedSeatType === '') return toast.error('Debes seleccionar un tipo de asiento');
      const currentCount = seatCounters[selectedSeatType] || 1;
      const autoSeatName = `${selectedSeatType}${currentCount}`;

      newElement.id = `seat-${selectedSeatType}-${autoSeatName.toLowerCase()}`;
      newElement.name = autoSeatName;

      setSeatCounters(prev => ({
        ...prev,
        [selectedSeatType]: currentCount + 1
      }));
    } else if (type === 'bathroom') {
      newElement.id = `bath-${bathCounter}`;
      newElement.name = `Baño ${bathCounter}`;
      setBathCounter(bathCounter + 1);
    } else if (type === 'stairs') {
      newElement.id = `stairs-${stairsCounter}`;
      newElement.name = `Escalera ${stairsCounter}`;
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

    const cooperative = localStorage.getItem('chaski-log') || '{}';
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

      <div className="bg-gradient-to-br from-blue-300 via-blue-100 to-blue-50 rounded-2xl shadow-lg border border-blue-200 p-8 mt-6">
        <div className="rounded-2xl bg-white shadow-xl p-6">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-2xl font-bold text-blue-800 mb-6">Estructura del Bus</h3>

            <div className="flex flex-col lg:flex-row gap-8 justify-center w-full">
              {/* Bus más pequeño */}
              <div
                className="relative w-[220px] h-[500px] border-4 border-blue-300 rounded-2xl bg-gradient-to-b from-blue-100 to-blue-50 shadow-lg"
                id={`bus-container-${selectedFloor}`}
              >
                <BusTemplate floorNumber={selectedFloor} >
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
                        style={{
                          left: `${absoluteLeft}px`,
                          top: `${absoluteTop}px`,
                        }}
                      >
                        {element.type === 'seat' && <SvgSeatComponent name={element.name} isSelected={selectedElement === element.id} status='f' />}
                        {element.type === 'bathroom' && <MdOutlineWc size={24} className="text-purple-600" />}
                        {element.type === 'stairs' && <TbStairs size={24} className="text-orange-500" />}
                      </div>
                    );
                  })}
                </BusTemplate>
              </div>

              {/* Panel de agregar elementos y campos */}
              <div className="bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 p-6 rounded-2xl shadow-xl flex flex-col items-center w-full max-w-sm border border-blue-200">
                <h2 className="text-blue-900 text-lg font-semibold mb-4">Agregar Elementos</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button onClick={() => addElement('seat')} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full" title="Agregar asiento">
                    <span className="text-xl font-bold">+</span>
                  </button>
                  <button onClick={() => addElement('bathroom')} className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full">
                    <MdOutlineWc size={20} />
                  </button>
                  <button onClick={() => addElement('stairs')} className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full">
                    <TbStairs size={20} />
                  </button>
                  <button onClick={removeSelectedElement} disabled={selectedElement === null} className={`bg-red-600 hover:bg-red-700 text-white p-3 rounded-full ${selectedElement === null ? 'opacity-50' : ''}`}>
                    <FaTrash size={20} />
                  </button>
                </div>

                {/* Campos que estaban abajo */}
                <input
                  type="text"
                  placeholder="Nombre de la Estructura"
                  value={busConfigurationName}
                  onChange={(e) => setBusConfigurationName(e.target.value)}
                  className="w-full mb-2 p-3 rounded-md bg-white text-blue-900 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={numFloors}
                  onChange={handleFloorChange}
                  disabled={floorElements[1].length > 0}
                  className="w-full mb-2 p-3 rounded-md bg-white text-blue-900 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value={1}>1 Piso</option>
                  <option value={2}>2 Pisos</option>
                </select>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(parseInt(e.target.value, 10))}
                  className="w-full mb-2 p-3 rounded-md bg-white text-blue-900 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {Array.from({ length: numFloors }, (_, i) => i + 1).map(floor => (
                    <option key={floor} value={floor}>Piso {floor}</option>
                  ))}
                </select>
                <SelectTypesComponent
                  value={selectedSeatType}
                  onSelectChange={handleSelectChange}
                />

                <button onClick={saveSeatsConfiguration} className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                  <FaSave /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypebusRegistration;
