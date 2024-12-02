import React, { useState, useEffect } from 'react';
import { registerEntrada } from '../services/asistenciaService';
import { registerInicioAlmuerzo } from '../services/asistenciaService';
import { registerFinAlmuerzo } from '../services/asistenciaService';
import { registerSalida } from '../services/asistenciaService';
import { registerHoraExtra } from '../services/asistenciaService';

const AttendanceControl = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLunchStarted, setIsLunchStarted] = useState(false);
  const [isLunchEnded, setIsLunchEnded] = useState(false);
  const [isExited, setIsExited] = useState(false);
  
  // Modal de horas extras
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [overtimeStartHour, setOvertimeStartHour] = useState('');
  const [overtimeEndHour, setOvertimeEndHour] = useState('');

  // Genera horas para los selects (AM/PM)
  const generateHours = () => {
    const hours = [];
    // Primero las horas AM de 12 a 11
    ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].forEach(h => {
      ['00', '30'].forEach(m => {
        hours.push(`${h.padStart(2, '0')}:${m} AM`);
      });
    });
  
    // Luego las horas PM de 12 a 11
    ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].forEach(h => {
      ['00', '30'].forEach(m => {
        hours.push(`${h.padStart(2, '0')}:${m} PM`);
      });
    });
  
    return hours;
  };

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

    // Nueva verificación para salida
    if (localStorage.getItem('lastExit') === todayDate) {
      setIsExited(true);
    }

    return () => clearInterval(timer);
  }, []);

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

  const handleRegistro = async (tipo) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const obraData = JSON.parse(localStorage.getItem('obra'));
      const token = localStorage.getItem('token');

      if (!userData || !obraData || !token) {
        throw new Error('No se encontraron los datos necesarios');
      }

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
      } else if (tipo === 'Salida') {
        await registerSalida(token, registroData);
        localStorage.setItem('lastExit', new Date().toLocaleDateString());
        setIsExited(true);
      }

      setSuccess(`${tipo} registrado exitosamente`);
      setError('');
    } catch (err) {
      setError(err.message || `Error al registrar ${tipo}`);
      setSuccess('');
    }
  };

  const handleOvertimeRegistration = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const obraData = JSON.parse(localStorage.getItem('obra'));
      const token = localStorage.getItem('token');

      if (!userData || !obraData || !token) {
        throw new Error('No se encontraron los datos necesarios');
      }

      const coordenadas = await getCoordenadas();

      const registroHoraExtra = {
        idUser: userData.id,
        nombreObra: obraData.nombre,
        centroCosto: obraData.centroCosto,
        nombre: userData.username,
        dni: userData.dni,
        horaInicio: overtimeStartHour,
        horaFin: overtimeEndHour,
        ubicacion: coordenadas
      };

      await registerHoraExtra(token, registroHoraExtra);
      
      setSuccess('Hora extra registrada exitosamente');
      setShowOvertimeModal(false);
      setOvertimeStartHour('');
      setOvertimeEndHour('');
    } catch (err) {
      setError(err.message || 'Error al registrar hora extra');
      setSuccess('');
    }
  };

  const horasDisponibles = generateHours();

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
          onClick={() => handleRegistro('Salida')}
          disabled={!isLunchEnded || isExited}
          className={`${
            isExited ? 'bg-red-500' : 'bg-indigo-500 hover:bg-indigo-600'
          } text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
        >
          {isExited ? 'Salida registrada' : 'Salida'}
        </button>
        
        <button
          onClick={() => setShowOvertimeModal(true)}
          disabled={!isExited}
          className={`${
            !isExited ? 'bg-slate-300' : 'bg-purple-500 hover:bg-purple-600'
          } text-white font-semibold py-3 px-6 rounded-lg transition-colors`}
        >
          Hora Extra
        </button>
      </div>

      {/* Modal de Horas Extras */}
      {showOvertimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4 text-center">Registrar Hora Extra</h2>
            <div className="mb-4">
              <label className="block mb-2">Hora de Inicio</label>
              <select 
                value={overtimeStartHour}
                onChange={(e) => setOvertimeStartHour(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccionar hora de inicio</option>
                {horasDisponibles.map((hora) => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-2">Hora de Fin</label>
              <select 
                value={overtimeEndHour}
                onChange={(e) => setOvertimeEndHour(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccionar hora de fin</option>
                {horasDisponibles.map((hora) => (
                  <option key={hora} value={hora}>{hora}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-between">
              <button 
                onClick={() => setShowOvertimeModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={handleOvertimeRegistration}
                disabled={!overtimeStartHour || !overtimeEndHour}
                className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}

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