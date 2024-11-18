// src/services/pruebaService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Cambia esto según tu configuración

export const accessUser = async () => {
    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    const response = await axios.get(`${API_URL}/accessUser`, {
        headers: {
            Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
        },
    });
    return response.data; // Retornar los datos de la respuesta
};
