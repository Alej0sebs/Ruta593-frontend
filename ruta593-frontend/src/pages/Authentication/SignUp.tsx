import { FaMapMarkedAlt, FaPhoneAlt, FaUserAstronaut } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import Ruta593Logo from "../../images/ruta593-logo/mountain.png";
import { FaRegUser } from 'react-icons/fa';
import { FaIdCard, FaUserTie } from 'react-icons/fa'; // Nuevos íconos para los campos adicionales
import { CreateUserT } from '../../types';
import createUser from '../../hooks/userCreation';
import { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { validateEcuadorianDNI } from '../../utils/userValidator.utils';
import toast from 'react-hot-toast';

const initialStateSignUp: CreateUserT = {
    full_name: '',
    dni: '',
    name: '',
    last_name: '',
    user_name: '',
    email: '',
    phone: '',
    address: '',
    role_id: '',
    cooperative_id: '',
};

const SignUp: React.FC = () => {
    const [inputSignUp, setInputSignUp] =
        useState<CreateUserT>(initialStateSignUp);
    const { loading, signUp } = createUser();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setInputSignUp({
            ...inputSignUp,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateEcuadorianDNI(inputSignUp.dni)) {
            signUp(inputSignUp);
        } else {
            toast.error('La cédula de identidad no es válida');
            return;
        }
    };

    return (
        <>
            <div className="flex h-screen items-center justify-center overflow-hidden">
                <div className="flex flex-wrap items-center w-full">
                    <div className="hidden w-full xl:block xl:w-1/2">
                        <div className="py-10 px-12 text-center">
                            <img className="dark:hidden" src={Ruta593Logo} alt="Logo" />
                            <img
                                className="hidden dark:block"
                                src={Ruta593Logo}
                                alt="Logo"
                            />
                        </div>
                    </div>

                    <div className="w-full border-stroke dark:border-none xl:w-1/2 xl:border-l-2">
                        <div className="w-full p-2 sm:p-10.5 xl:p-17.5">
                            <h2 className="mb-9 mt-[40px] text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                                Registro de Usuarios
                            </h2>
                            <form onSubmit={handleSubmit}>


                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="mb-2">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Cédula de Identidad
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength={10}
                                                placeholder="Ingrese su CI"
                                                id="dni"
                                                value={inputSignUp.dni}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            <span className="absolute right-4 top-4">
                                                <FaIdCard className="w-[22px] h-[22px]" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Nombre
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength={20}
                                                placeholder="Ingrese su nombre"
                                                id="name"
                                                value={inputSignUp.name}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            <span className="absolute right-4 top-4">
                                                <FaRegUser className="w-[22px] h-[22px]" />
                                            </span>
                                        </div>
                                    </div>
                                </div>




                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="mb-2">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Apellido
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                maxLength={20}
                                                placeholder="Ingrese su apellido"
                                                id="last_name"
                                                value={inputSignUp.last_name}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            <span className="absolute right-4 top-4">
                                                <FaUserTie className="w-[22px] h-[22px]" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Username */}
                                    <div className="mb-2">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Nombre de usuario
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Usuario"
                                                maxLength={20}
                                                id="user_name"
                                                value={inputSignUp.user_name}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            <span className="absolute right-4 top-4">
                                                <FaUserAstronaut className="w-[22px] h-[22px]" />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-2">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Ingresa tu email"
                                            id="email"
                                            maxLength={50}
                                            value={inputSignUp.email}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        <span className="absolute right-4 top-4">
                                            <MdEmail className="w-[22px] h-[22px]" />
                                        </span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="mb-2">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Telefono
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            placeholder="Ingresa tu numero de telefono"
                                            id="phone"
                                            maxLength={15}
                                            value={inputSignUp.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        <span className="absolute right-4 top-4">
                                            <FaPhoneAlt className="w-[22px] h-[22px]" />
                                        </span>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="mb-2">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Dirección
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Ingresa tu dirección"
                                            id="address"
                                            maxLength={80}
                                            value={inputSignUp.address}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        <span className="absolute right-4 top-4">
                                            <FaMapMarkedAlt className="w-[22px] h-[22px]" />
                                        </span>
                                    </div>
                                </div>

                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Rol de Usuario
                                </label>

                                <div className="relative">
                                    <select
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-11.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary appearance-none"
                                        name="role"
                                        id="role_id"
                                        value={inputSignUp.role_id}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            Selecciona un rol
                                        </option>
                                        <option value="admin">Administrador</option>
                                        <option value="clerk">Recepcionista</option>
                                        <option value="drive">Conductor</option>
                                    </select>
                                    <span className="absolute right-4.5 top-4">
                                        <RiTeamFill className="w-[22px] h-[22px]" />
                                    </span>
                                </div>
                                <br />
                                <div className="mb-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                    >
                                        {loading ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            'Registrar'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default SignUp;
