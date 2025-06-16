// InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  id,
  value,
  placeholder,
  onChange,
  icon,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-2.5 block font-medium text-black dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
        />
        {icon && <span className="absolute right-4 top-4">{icon}</span>}
      </div>
    </div>
  );
};

export default InputField;
