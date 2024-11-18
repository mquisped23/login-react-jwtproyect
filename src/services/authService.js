// src/services/authService.js
import axios from 'axios';

//const API_URL = 'http://192.168.18.14:8080/login';
const API_URL = 'http://localhost:8080/login';

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(API_URL, loginData);
    console.log("El response es: ", response.data);
    return response.data;
  } catch (error) {
    
    console.error('Error logging in', error);
    throw error;
  }

};

