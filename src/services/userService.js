// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/createUser';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    console.log("el response es: " ,response)
    return response.data;
  } catch (error) {
    console.error('Error registering user', error);
    throw error;
  }
};
