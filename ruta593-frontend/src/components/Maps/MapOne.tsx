interface SwitcherProps {
    onChange: (checked: boolean) => void;
    checked?: boolean;
}

const Switcher = ({ onChange, checked }: SwitcherProps) => {

    const handleToggle = () => {
        onChange(!checked);
    }


    return (
        <input
            type="checkbox"
            value="synthwave"
            checked={checked}
            className="toggle theme-controller col-span-2 col-start-1 row-start-1 bg-blue-300 [--tglbg:theme(colors.blue.900)] checked:border-blue-800 checked:bg-blue-50 checked:[--tglbg:theme(colors.green.500)]"
            onChange={handleToggle} />

    )
}

export default Switcher;