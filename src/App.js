// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import Prueba from './components/Prueba';
import RegisterObra from './components/RegisterObra';
import ListObra from './components/ListObra';
import ObraSelector from './components/SelectObra'; 
import Welcome from './components/Welcome'; // Importar el componente de bienvenida
import PrivateRoute from './components/PrivateRoute'; // Importa la ruta privada
import "./App.css"
import ListAsistencias from './components/ListAsitenciaEntrada';
import ReporteAsistencias from './components/Reportes';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/access_user" element={<PrivateRoute><Prueba /></PrivateRoute>} /> 
       
          {/* Proteger la ruta de bienvenida */}
          <Route path="/welcome" element={<PrivateRoute><Welcome /></PrivateRoute>} /> 
          <Route path="/obra/registrar" element={<PrivateRoute><RegisterObra /></PrivateRoute>} /> 
          <Route path="/obra/listar" element={<PrivateRoute><ListObra /></PrivateRoute>} /> 
          <Route path="/asistencia/listar/entrada" element={<PrivateRoute><ListAsistencias /></PrivateRoute>} /> 
          <Route path="/asistencias/reportes" element={<PrivateRoute><ReporteAsistencias /></PrivateRoute>} /> 
          <Route path="/obra/seleccionar" element={<PrivateRoute><ObraSelector /></PrivateRoute>} /> 
          
          {/* Añade las demás rutas según sea necesario */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
