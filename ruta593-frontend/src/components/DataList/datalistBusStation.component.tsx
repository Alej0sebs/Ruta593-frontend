import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { BusStationT } from "../../types";

type DataListOption = Partial<BusStationT>;

interface DataListProps {
    id: string,
    label: string,
    options: DataListOption[],
    placeholder: string,
    onSelect: (value: string) => void,
    value: string
    iconP: IconType
    className?: string
};

const DataListBusStation = ({ id, label, options, placeholder, onSelect, value, iconP: Icon, className }: DataListProps) => {
    const [inputValue, setInputValue] = useState(value);

    // Sincronizar inputValue con value cada vez que value cambia
    useEffect(() => {
        const selectedOption = options.find((option) => option.id === value);
        setInputValue(selectedOption ? selectedOption.name || "" : "");
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedName = e.target.value;
        setInputValue(selectedName); // Actualiza el valor del input

        const selectedOption = options.find((options) => options.name === selectedName); //Busco el elemento que tenga el nombre seleccionado y busco su id 
        if (selectedOption) {
            onSelect(selectedOption.id as string); // Notifica el valor al padre si es necesario
        } else {
            onSelect(""); // Notifica el valor al padre si es necesario
        }
    };

    return (
        <div className={`relative ${className}`}>
            {label && <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor={id}>{label}
            </label>}
            <div className="relative">
                <span className="absolute left-4.5 top-4">
                    {Icon && (<Icon />)}
                </span>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    list={id}
                    placeholder={placeholder}
                    onChange={handleInputChange}
                    value={inputValue}
                />
                <datalist id={id}>
                    {options.map((option) => (
                        <option key={option.id} value={option.name}>
                            {option.city_bus_station?.name}
                        </option>
                    ))}
                </datalist>

            </div>
        </div>
    );
};

export default DataListBusStation;
