// src/components/Prueba.js
import React, { useEffect, useState } from 'react';
import { accessUser } from '../services/pruebaService'; // Importar el servicio

const Prueba = () => {
    const [message, setMessage] = useState(''); // Para almacenar el mensaje
    const [error, setError] = useState(''); // Para almacenar errores

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await accessUser(); // Llamar al servicio
                setMessage(data); // Almacenar el mensaje en el estado
            } catch (err) {
                setError('Error al acceder al recurso. Asegúrate de estar autenticado.'); // Manejar errores
                console.error(err);
            }
        };
        fetchData(); // Ejecutar la función para obtener los datos
    }, []);

    return (
        <div>
            <h2>Prueba de Acceso</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores si existen */}
            {message && <p>{message}</p>} {/* Mostrar el mensaje si existe */}
        </div>
    );
};

export default Prueba;
