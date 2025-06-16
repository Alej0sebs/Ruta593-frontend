import { Link } from 'react-router-dom';
import { useState } from 'react';
import DropdownUser from './DropdownUser';
import { FaHome, FaCogs, FaUserShield, FaUsers, FaBus, FaUser } from 'react-icons/fa';

// ✅ IMPORTACIÓN CORRECTA DE LOGO DESDE VITE
import RutaLogo from '../../images/ruta593-logo/ruta593.png';
import MountainLogo from '../../images/ruta593-logo/mountain.png';

const Header = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <header className="bg-[#FEDD00] text-[#172433] fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center font-bold text-xl">
          <img src={RutaLogo} alt="Logo" className="h-8 mr-2" />
        </Link>

        {/* MENÚ PRINCIPAL */}
        <nav className="hidden md:flex space-x-6 font-semibold items-center relative">
          {/* DASHBOARD directo */}
          <Link to="" className="flex items-center gap-1 hover:underline">
            <FaHome /> Dashboard
          </Link>

          {/* REGISTROS */}
          <div className="relative">
            <button onClick={() => toggleMenu('registros')} className="flex items-center gap-1">
              <FaUsers /> Registros
            </button>
            {openMenu === 'registros' && (
              <div className="absolute bg-white text-black mt-2 p-2 shadow-lg rounded-md min-w-[220px] z-10">
                <Link to="/register/linkStations" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Estaciones Vinculadas</Link>
                <Link to="/register/typeSeats" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Tipo de Asiento</Link>
                <Link to="/register/typebus" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Estructura de Buses</Link>
                <Link to="/register/bus" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Registro de Buses</Link>
                <Link to="/register/tickets" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Series de Tickets</Link>
                <Link to="/register/busStations" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Terminales Registradas</Link>
              </div>
            )}
          </div>

          {/* PROCESOS */}
          <div className="relative">
            <button onClick={() => toggleMenu('procesos')} className="flex items-center gap-1">
              <FaCogs /> Procesos
            </button>
            {openMenu === 'procesos' && (
              <div className="absolute bg-white text-black mt-2 p-2 shadow-lg rounded-md min-w-[220px] z-10">
                <Link to="/processes/frequency" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Creación de Frecuencias</Link>
                <Link to="/processes/routes" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Creación de Rutas</Link>
                <Link to="/processes/frequency-list" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>Venta de Tickets</Link>
                
              </div>
            )}
          </div>

          {/* ADMINISTRADOR */}
          <div className="relative">
            <button onClick={() => toggleMenu('administrador')} className="flex items-center gap-1">
              <FaUserShield /> Administrador
            </button>
            {openMenu === 'administrador' && (
              <div className="absolute bg-white text-black mt-2 p-2 shadow-lg rounded-md min-w-[200px] z-10">
                <Link to="/auth/signup" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setOpenMenu(null)}>
                  Registro de Usuarios
                </Link>
              </div>
            )}
          </div>

          {/* COOPERATIVA */}
          <Link to="/profile" className="flex items-center gap-1 hover:underline">
            <FaBus /> Cooperativa
          </Link>

          {/* MI PERFIL */}
          <Link to="/settings" className="flex items-center gap-1 hover:underline">
            <FaUser /> Mi Perfil
          </Link>
        </nav>

        {/* PERFIL */}
        <DropdownUser />
      </div>
    </header>
  );
};

export default Header;