
import axios from 'axios';

const API_URL = 'http://localhost:8080'; 
//const API_URL = 'http://192.168.18.14:8080'; 

export const registerEntrada = async (token, registroEntrada) => {
    try {
        const response = await axios.post(
            `${API_URL}/asistenciaEntrada`, 
            registroEntrada,  // Datos de la obra (nombre y centroCosto)
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
            throw new Error(error.response.data.message || 'Error al registrar la entrada');
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            throw new Error('No se recibió respuesta del servidor');
        } else {
            // Algo sucedió al configurar la petición
            throw new Error('Error al realizar la petición');
        }
    }
};



export const registerInicioAlmuerzo = async (token, registroInico) => {
    try {
        const response = await axios.post(
            `${API_URL}/refrigerio/inicio`, 
            registroInico,  // Datos de la obra (nombre y centroCosto)
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
            throw new Error(error.response.data.message || 'Error al registrar la entrada');
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            throw new Error('No se recibió respuesta del servidor');
        } else {
            // Algo sucedió al configurar la petición
            throw new Error('Error al realizar la petición');
        }
    }
};
export const registerFinAlmuerzo = async (token, registroFin) => {
    try {
        const response = await axios.post(
            `${API_URL}/refrigerio/fin`, 
            registroFin,  // Datos de la obra (nombre y centroCosto)
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
            throw new Error(error.response.data.message || 'Error al registrar la entrada');
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            throw new Error('No se recibió respuesta del servidor');
        } else {
            // Algo sucedió al configurar la petición
            throw new Error('Error al realizar la petición');
        }
    }
};


// Función para listar todas las entradas
export const getEntradas = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/asistenciaEntrada`, 
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
            throw new Error(error.response.data.message || 'Error al obtener las asistencias');
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error('Error al realizar la petición');
        }
    }
};


// Función para eliminar una asistencia entrada por ID
export const deleteAsistenciaEntrada = async (id, token) => {
    try {
        const response = await axios.delete(
            `${API_URL}/asistenciaEntrada/${id}`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Error al eliminar la la asistencia entrada');
        } else if (error.request) {
            throw new Error('No se recibió respuesta del servidor');
        } else {
            throw new Error('Error al realizar la petición');
        }
    }
};
