import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './NavBar';
import AttendanceControl from './VistaAsistencia';

const Welcome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logoutMessage } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return <div>No hay información del usuario.</div>;
  }

  const role = user.roles[0]?.authority;
  const username = user.username;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div className="flex-1 p-4 lg:p-8 mt-14 lg:mt-0">
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 break-words">
              Bienvenido, {username}
            </h1>

            {/* Role badge */}
            <div className="mt-2 flex flex-wrap gap-2">
              {role === 'ROLE_ADMIN' && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  ADMIN
                </span>
              )}
              {role === 'ROLE_USER' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  USER
                </span>
              )}
              {role === 'ROLE_SUPERVISOR' && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  SUPERVISOR
                </span>
              )}
              {role === 'ROLE_PERSONAL' && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  PERSONAL
                </span>
              )}
            </div>
          </div>

          {/* Mensaje de logout */}
          {logoutMessage && (
            <div className="mb-4 p-3 lg:p-4 bg-blue-50 text-blue-700 rounded-lg text-sm lg:text-base">
              {logoutMessage}
            </div>
          )}

          {/* Contenedor para AttendanceControl */}
          <div className="flex justify-center items-center mt-4 lg:mt-6">
            <div className="w-full max-w-xl">
              <AttendanceControl />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;