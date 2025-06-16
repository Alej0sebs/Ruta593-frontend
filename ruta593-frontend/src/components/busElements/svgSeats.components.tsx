type SvgSeatComponentProps = {
    name: string,
    isSelected: boolean,
    status: string
};

export default function SvgSeatComponent({ name, isSelected, status }: SvgSeatComponentProps) {
    const getColor = () => {
        switch (status) {
            case "f":
                return "#FFF"; // Fondo blanco para asientos libres
            case "r":
                return "#FF4500"; //FF4500 Fondo amarillo para asientos reservados
            case "s":
                return "#00ff80"; // Fondo rojo para asientos vendidos
            default:
                return "#FFF"; // Color por defecto
        }
    };

    return (
        <svg
            width="60"
            height="52"
            viewBox="0 0 40 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="seat"
        >
            <rect
            x="8.75"
            y="2.75"
            width="22.5"
            height="26.5"
            rx="2.25"
            fill={isSelected ? "#00ff80" : getColor()}
            stroke="#B8B8B8"
            strokeWidth="1.5"
            strokeLinejoin="round"
            />
            <rect
            x="10.25"
            y="11.75"
            width="14.5"
            height="5.5"
            rx="2.25"
            transform="rotate(90 10.25 11.75)"
            fill={isSelected ? "#00ff80" : getColor()}
            stroke="#B8B8B8"
            strokeWidth="1.5"
            strokeLinejoin="round"
            />
            <rect
            x="35.25"
            y="11.75"
            width="14.5"
            height="5.5"
            rx="2.25"
            transform="rotate(90 35.25 11.75)"
            fill={isSelected ? "#00ff80" : getColor()}
            stroke="#B8B8B8"
            strokeWidth="1.5"
            strokeLinejoin="round"
            />
            <rect
            x="8.75"
            y="22.75"
            width="22.5"
            height="6.5"
            rx="2.25"
            fill={isSelected ? "#00ff80" : getColor()}
            stroke="#B8B8B8"
            strokeWidth="1.5"
            strokeLinejoin="round"
            />
            <text
            width="20"
            height="20"
            x="20"
            y="18"
            fill="#000"
            fontSize="10"
            textAnchor="middle"
            >
            {name}
            </text>
        </svg>
    );
}
