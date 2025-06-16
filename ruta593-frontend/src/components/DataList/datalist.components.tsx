import { useEffect, useState } from "react";
import { IconType } from "react-icons";

interface DataListProps<T> {
    id: string;
    label: string;
    options: Partial<T>[];
    placeholder: string;
    onSelect: (value: string) => void;
    value: string;
    iconP?: IconType;
    className?: string;
    opKey: keyof T; // Propiedad para la clave de la opción
    opValue: keyof T; // Propiedad para el valor de la opción
    optionP: keyof T; // Propiedad opcional para mostrar en la lista
};

const DataList = <T,>({
    id,
    label,
    options,
    placeholder,
    onSelect,
    value,
    iconP: Icon,
    className,
    opKey,
    opValue,
    optionP,
}: DataListProps<T>) => {
    const [inputValue, setInputValue] = useState(value);

    // Sincronizar inputValue con value cada vez que value cambia
    useEffect(() => {
        const selectedOption = options.find((option) => option[opKey] === value);
        setInputValue(selectedOption ? (selectedOption[opValue] as string) || "" : "");
    }, [value, options, opKey, opValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedName = e.target.value;
        setInputValue(selectedName); // Actualiza el valor del input

        const selectedOption = options.find((option) => option[opValue] === selectedName);
        if (selectedOption) {
            onSelect(selectedOption[opKey] as string); // Notifica el valor al padre si es necesario
        } else {
            onSelect(""); // Notifica el valor al padre si es necesario
        }
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <span className="absolute left-4.5 top-4">
                    {Icon && <Icon />}
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
                        <option
                            key={option[opKey] as React.Key}
                            value={option[opValue] as string}
                        >
                            {option[optionP] as string}
                        </option>
                    ))}
                </datalist>
            </div>
        </div>
    );
};

export default DataList;
