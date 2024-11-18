// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Verificar si el token está presente en el almacenamiento local
    return localStorage.getItem('token') !== null;
  });
  const [user, setUser] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState('');

  // Puedes usar useEffect para cargar el usuario desde el almacenamiento local si es necesario
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    
    localStorage.setItem('user', JSON.stringify(userData)); // Guardar el usuario
    setLogoutMessage(''); // Limpiar el mensaje al iniciar sesión
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLogoutMessage('Has cerrado sesión correctamente.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, logoutMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
