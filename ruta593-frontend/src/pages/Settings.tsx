import React, { useState, useEffect } from 'react';
import useUsers from '../hooks/useUsers';
import {
  FaRegUser,
  FaUserTie,
  FaUserAstronaut,
  FaDirections,
} from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext'; // Asumiendo que tienes este contexto

const Settings: React.FC = () => {
  const { getUsersByDni, updateUsers, loading } = useUsers();
  const { authUser } = useAuthContext(); // Obtener datos del usuario autenticado
  const [dni, setDni] = useState(authUser?.dni || ''); // Inicializar con el DNI del usuario autenticado
  const [formData, setFormData] = useState({
    user_name: '',
    phone: '',
    password: '',
    address: '',
  });
  const [, setIsUserFound] = useState(false);
  const [, setIsLoadingData] = useState(false);

  useEffect(() => {
    // Aquí emulamos que los datos del usuario se cargan automáticamente al acceder a la página
    if (authUser?.dni) {
      loadUserData(authUser.dni); // Llamamos a la función para cargar los datos automáticamente
    }
  }, [authUser]); // Solo se ejecuta cuando cambia el usuario autenticado

  const loadUserData = async (dni: string) => {
    setIsLoadingData(true);
    try {
      const userData = await getUsersByDni(dni);
      if (userData) {
        setFormData({
          user_name: userData.user_name || '',
          phone: userData.phone || '',
          password:'',
          // No precargar la contraseña por seguridad
          address: userData.address || '',
        });
        setIsUserFound(true);
      } else {
        setIsUserFound(false);
      }
    } catch (error) {
      throw new Error('Error al cargar los datos del usuario'); 
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDni(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      await updateUsers(dni, updatedData); // Enviar el DNI oculto al backend
    } catch (error) {
      throw new Error('Error al actualizar los datos del usuario');
    }
  };

  return (
    <div className="settings-container max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Configuración del Usuario
      </h1>

      {/* Formulario para actualizar datos */}
      <form
        onSubmit={handleUpdateSubmit}
        className="update-form bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-sm"
      >
        {/* DNI (oculto visualmente) */}
        <div
          className="mb-5.5 flex flex-col gap-5.5 sm:flex-row"
          style={{ display: 'none' }}
        >
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Cédula de Identidad
            </label>
            <div className="relative">
              <input
                type="text"
                id="dni"
                value={dni}
                onChange={handleDniChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
                disabled // Bloqueamos el campo para que no pueda ser editado
              />
            </div>
          </div>
        </div>

        {/* Nombre de usuario */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Nombre de usuario
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ingrese su nuevo nombre de usuario"
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <FaUserAstronaut className="w-[22px] h-[22px]" />
              </span>
            </div>
          </div>
        </div>

        {/* Direccion del Usuario */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Direccion del Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ingrese su nueva dirección"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <FaDirections className="w-[22px] h-[22px]" />
              </span>
            </div>
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="Ingrese su número de teléfono"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <FaRegUser className="w-[22px] h-[22px]" />
              </span>
            </div>
          </div>
        </div>

        {/* Contraseña */}
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Nueva contraseña"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
              <span className="absolute right-4 top-4">
                <FaUserTie className="w-[22px] h-[22px]" />
              </span>
            </div>
          </div>
        </div>

        {/* Botón para actualizar el perfil */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition dark:bg-green-700 dark:hover:bg-green-600"
        >
          {loading ? 'Actualizando...' : 'Actualizar Perfil'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
