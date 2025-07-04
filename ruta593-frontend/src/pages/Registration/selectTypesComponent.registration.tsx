import { useState } from "react";
import useTypeSeats from "../../hooks/useTypeSeats";

// Si usas TypeScript, define los props así:
export interface SelectTypesComponentProps {
  value: string;
  onSelectChange: (selectedValue: string) => void;
}

const SelectTypesComponent = ({ value, onSelectChange }: SelectTypesComponentProps) => {
    const { selectSeatTypes } = useTypeSeats();
    const [selectedSeatType, setSelectedSeatType] = useState<string>('');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedSeatType(value);
        onSelectChange(value);
    };

    return (
        <div className='relative z-5'>
            <select value={selectedSeatType} onChange={handleSelectChange}
                className={`relative z-5 w-full appearance-none rounded-lg border border-stroke bg-white py-3 pl-5 pr-10 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${selectSeatTypes ? 'text-black dark:text-white' : 'text-gray-400'
                    }`}>
                {!selectedSeatType && <option value="">Tipo de asiento</option>}
                {selectSeatTypes.map((seatType) => (
                    <option key={seatType.id} value={seatType.special_caracter}>
                        {seatType.name}
                    </option>
                ))}
            </select>
            <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g opacity="0.8">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill="#637381"
                        ></path>
                    </g>
                </svg>
            </span>
        </div>
    )
}

export default SelectTypesComponent;