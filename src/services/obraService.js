// src/services/pruebaService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Cambia esto según tu configuración
//const API_URL = 'http://192.168.18.14:8080'; // Cambia esto según tu configuración

export const registerObra = async (token, obraData) => {
    try {
        const response = await axios.post(
            `${API_URL}/obras`, 
            obraData,  // Datos de la obra (nombre y centroCosto)
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
            throw new Error(error.response.data.message || 'Error al registrar la obra');
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            throw new Error('No se recibió respuesta del servidor');
        } else {
            // Algo sucedió al configurar la petición
            throw new Error('Error al realizar la petición');
        }
    }
};



// Función para listar todas las obras
export const getObras = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/obras`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        // Manejo de errores
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener las obras');
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error('Error al realizar la petición');
        }
    }
};

//Obtener centro de costos por nombre de obra
export const getCentroCostoByNameObra = async (name, token) => {
    try {
        const response = await axios.get(
            `${API_URL}/obras/centrosCosto/${name}`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        // Manejo de errores
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al obtener los centros de costo');
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error('Error al realizar la petición');
        }
    }
};



// Función para eliminar una obra por ID
export const deleteObra = async (id, token) => {
    try {
        const response = await axios.delete(
            `${API_URL}/obras/${id}`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al eliminar la obra');
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error('Error al realizar la petición');
        }
    }
};