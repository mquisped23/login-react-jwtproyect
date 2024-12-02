import React, { useState } from 'react';
import { Bell, Home, LineChart, Search, ChevronDown, ChevronUp, Building, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  const [isObraMenuOpen, setIsObraMenuOpen] = useState(false);
  const [isAsistenciasMenuOpen, setIsAsistenciasMenuOpen] = useState(false); // Nuevo estado para Mis Asistencias
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Solo visible en móvil */}
      <button 
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        <Menu className="w-6 h-6 text-blue-600" />
      </button>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navbar principal */}
      <div className={`
        fixed lg:static 
        h-screen w-64 
        bg-white p-4 
        flex flex-col 
        border-r shadow-lg
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
        z-50
      `}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-bold text-lg text-blue-600">Empresita</span>
          <button className="ml-auto">
            <Bell className="w-4 h-4 text-orange-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none border border-gray-200"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4">
          <Link 
            to="/welcome" 
            className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home className="w-5 h-5" />
            <span>Inicio</span>
          </Link>

          {/* Menú desplegable de Mis Asistencias */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsAsistenciasMenuOpen(!isAsistenciasMenuOpen)}
              className="flex items-center justify-between gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <LineChart className="w-5 h-5" />
                <span>Mis Asistencias</span>
              </div>
              {isAsistenciasMenuOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Submenú de Mis Asistencias */}
            {isAsistenciasMenuOpen && (
              <div className="ml-7 mt-2 flex flex-col gap-2">
                <Link
                  to="/asistencia/listar/entrada"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>• Ver Asistencias</span>
                </Link>
              
                <Link
                  to="/asistencias/reportes"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>• Reportes</span>
                </Link>
                <Link
                  to="/asistencias/dashboard"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>• Dashboard</span>
                </Link>
              </div>
            )}
          </div>

          {/* Menú desplegable de Obras */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsObraMenuOpen(!isObraMenuOpen)}
              className="flex items-center justify-between gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5" />
                <span>Obras</span>
              </div>
              {isObraMenuOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Submenú de Obras */}
            {isObraMenuOpen && (
              <div className="ml-7 mt-2 flex flex-col gap-2">
                <Link
                  to="/obra/seleccionar"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>• Seleccionar Obra</span>
                </Link>
                <Link
                  to="/obra/registrar"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>• Registrar Obra</span>
                </Link>
                <Link
                  to="/obra/listar"
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>• Listar Obras</span>
                </Link>
              </div>
            )}
          </div>

          {/* Botón de logout */}
          <button
            onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
            }}
            className="mt-auto flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
