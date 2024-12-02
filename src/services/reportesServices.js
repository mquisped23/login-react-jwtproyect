// src/services/asistenciaEntradaService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Cambia esto según tu configuración

export const filtrarEntrada = async (token, filtroData) => {
    try {
        const response = await axios.post(
            `${API_URL}/asistenciaEntrada/filtrar`,
            filtroData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        // Manejo de errores
        if (error.response) {
            // El servidor respondió con un estado fuera del rango 2xx
            throw new Error(error.response.data.message || 'Error al filtrar entradas');
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            throw new Error('No se recibió respuesta del servidor');
        } else {
            // Algo sucedió al configurar la petición
            throw new Error('Error al realizar la petición de filtrado');
        }
    }
};


// Método para obtener fechas
export const obtenerFechas = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/asistenciaEntrada/fechas`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        // Transformar el arreglo de fechas a formato de cadena
        return response.data.map(fecha => {
            // Asumiendo que el array es [año, mes, día]
            return `${fecha[0]}-${String(fecha[1]).padStart(2, '0')}-${String(fecha[2]).padStart(2, '0')}`;
        });
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener las fechas');
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error('Error al realizar la petición de fechas');
        }
    }
};

// Método para obtener obras
export const obtenerObras = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/asistenciaEntrada/obras`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener las obras');
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error('Error al realizar la petición de obras');
        }
    }
};