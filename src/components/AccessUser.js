// src/components/AccessUser.js
import React, { useEffect, useState } from 'react';
import { getProtectedData } from '../services/prueba'; // Servicio que consume la API

const AccessUser = () => {
  const [message, setMessage] = useState(''); // Guardamos la respuesta del API
  const [error, setError] = useState(''); // Manejamos errores

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Recuperamos el token del localStorage
      if (!token) {
        setError('No se encontró un token. Inicia sesión nuevamente.');
        return;
      }

      try {
        const response = await getProtectedData(token); // Llamada al servicio con token
        setMessage(response); // Guardamos el mensaje en el estado
      } catch (err) {
        setError('Error al obtener los datos. Token inválido o expirado.');
      }
    };

    fetchData(); // Ejecutar la función al montar el componente
  }, []);

  return (
    <div>
      <h2>Acceso a Datos Protegidos</h2>
      {message && <p>{message}</p>} {/* Mostrar mensaje de respuesta */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores */}
    </div>
  );
};

export default AccessUser;
