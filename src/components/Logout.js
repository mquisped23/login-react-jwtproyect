// src/components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa el contexto

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Obtén la función de logout del contexto

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    logout(); // Marca al usuario como no autenticado
    navigate('/login'); // Redirige a la página de inicio de sesión
  };

  return (
    <button onClick={handleLogout}>Cerrar Sesión</button>
  );
};

export default Logout;
