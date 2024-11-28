import React, { useState, useEffect } from 'react';
import { registerEntrada } from '../services/asistenciaService';
import { registerInicioAlmuerzo } from '../services/asistenciaService';
import { registerFinAlmuerzo } from '../services/asistenciaService';

const AttendanceControl = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLunchStarted, setIsLunchStarted] = useState(false);
  const [isLunchEnded, setIsLunchEnded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const todayDate = new Date().toLocaleDateString();

    // Verificar estado de Ingreso
    if (localStorage.getItem('lastEntry') === todayDate) {
      setIsRegistered(true);
    }

    // Verificar estado de Inicio Almuerzo
    if (localStorage.getItem('lastLunchStart') === todayDate) {
      setIsLunchStarted(true);
    }

    // Verificar estado de Fin Almuerzo
    if (localStorage.getItem('lastLunchEnd') === todayDate) {
      setIsLunchEnded(true);
    }

    return () => clearInterval(timer);
  }, []);

  const handleRegistro = async (tipo) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const obraData = JSON.parse(localStorage.getItem('obra'));
      const token = localStorage.getItem('token');

      if (!userData || !obraData || !token) {
        throw new Error('No se encontraron los datos necesarios');
      }

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
        tipo, // Diferenciador para el registro
      };

      await registerEntrada(token, registroData);

      setSuccess(`${tipo} registrado exitosamente`);
      setError('');

 
      if (tipo === 'Ingreso') {
        await registerEntrada(token, registroData);
        localStorage.setItem('lastEntry', new Date().toLocaleDateString());
        setIsRegistered(true);
      } else if (tipo === 'Inicio Almuerzo') {
        await registerInicioAlmuerzo(token, registroData);
        localStorage.setItem('lastLunchStart', new Date().toLocaleDateString());
        setIsLunchStarted(true);
      } else if (tipo === 'Fin Almuerzo') {
        await registerFinAlmuerzo(token, registroData);
        localStorage.setItem('lastLunchEnd', new Date().toLocaleDateString());
        setIsLunchEnded(true);
      }
  
      setSuccess(`${tipo} registrado exitosamente`);
      setError('');
    } catch (err) {
      setError(err.message || `Error al registrar ${tipo}`);
      setSuccess('');
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-blue-600 tracking-wider">
          {currentTime.toLocaleTimeString()}
        </div>
        <div className="text-lg text-gray-600 mt-3 capitalize">
          {currentTime.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-md mx-auto">
        <button
          onClick={() => handleRegistro('Ingreso')}
          disabled={isRegistered}
          className={`${
            isRegistered ? 'bg-red-500' : 'bg-emerald-500 hover:bg-emerald-600'
          } text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
        >
          {isRegistered ? 'Ingreso registrado' : 'Ingreso'}
        </button>
        <button
          onClick={() => handleRegistro('Inicio Almuerzo')}
          disabled={!isRegistered || isLunchStarted}
          className={`${
            isLunchStarted ? 'bg-red-500' : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
        >
          {isLunchStarted ? 'Inicio Almuerzo registrado' : 'Inicio Almuerzo'}
        </button>
        <button
          onClick={() => handleRegistro('Fin Almuerzo')}
          disabled={!isLunchStarted || isLunchEnded}
          className={`${
            isLunchEnded ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
        >
          {isLunchEnded ? 'Fin Almuerzo registrado' : 'Fin Almuerzo'}
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
