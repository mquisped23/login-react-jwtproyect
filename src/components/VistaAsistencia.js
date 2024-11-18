import React, { useState, useEffect } from 'react';
import { registerEntrada } from '../services/asistenciaService';

const AttendanceControl = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Al cargar el componente, verificar si ya se registró la entrada para hoy
    const lastEntry = localStorage.getItem('lastEntry');
    const todayDate = new Date().toLocaleDateString();

    if (lastEntry === todayDate) {
      setIsRegistered(true);
    }

    return () => clearInterval(timer);
  }, []);

  const handleIngreso = async () => {
    try {
      // Obtener datos del localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      const obraData = JSON.parse(localStorage.getItem('obra'));
      const token = localStorage.getItem('token');

      if (!userData || !obraData || !token) {
        throw new Error('No se encontraron los datos necesarios');
      }

      // Obtener coordenadas
      const getCoordenadas = () => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coordenadas = `${position.coords.latitude},${position.coords.longitude}`;
              resolve(coordenadas);
            },
            (error) => {
              reject(new Error('Error al obtener la ubicación: ' + error.message));
            }
          );
        });
      };

      const coordenadas = await getCoordenadas();

      const registroData = {
        idUser: userData.id,
        nombre: userData.username,
        dni: userData.dni,
        nombreObra: obraData.nombre,
        centroCosto: obraData.centroCosto,
        ubicacion: coordenadas,
      };

      // Registrar la entrada en el servidor
      await registerEntrada(token, registroData);

      // Actualizar el estado y el mensaje de éxito
      setSuccess('Ingreso registrado exitosamente');
      setError('');

      // Guardar la fecha actual en el localStorage
      const todayDate = new Date().toLocaleDateString();
      localStorage.setItem('lastEntry', todayDate);
      setIsRegistered(true);
    } catch (err) {
      setError(err.message || 'Error al registrar ingreso');
      setSuccess('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Reloj y Fecha */}
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-blue-600 tracking-wider">
          {currentTime.toLocaleTimeString()}
        </div>
        <div className="text-lg text-gray-600 mt-3 capitalize">
          {currentTime.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Botones de Control */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-md mx-auto">
        <button
          onClick={handleIngreso}
          disabled={isRegistered}
          className={`${
            isRegistered ? 'bg-red-500' : 'bg-emerald-500 hover:bg-emerald-600'
          } text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
        >
          {isRegistered ? 'Ingreso registrado' : 'Ingreso'}
        </button>
        <button
          disabled
          className="bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Almuerzo
        </button>
        <button
          disabled
          className="bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Fin Almuerzo
        </button>
        <button
          disabled
          className="bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Salida
        </button>
        <button
          disabled
          className="bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Hora Extra
        </button>
      </div>

      {/* Mensajes de éxito/error */}
      {error && (
        <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-6 p-3 bg-green-100 text-green-700 rounded-lg text-center">
          {success}
        </div>
      )}
    </div>
  );
};

export default AttendanceControl;
