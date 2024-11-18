import React, { useEffect, useState } from 'react';
import { registerObra } from '../services/obraService';
import Navbar from './NavBar';

const RegisterObra = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    centroCosto: ''
  });

  // Removemos el useEffect ya que no necesitamos hacer una llamada al cargar el componente
  // Este componente solo debe registrar obras cuando se envía el formulario

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
        setError('No se encontró un token. Inicia sesión nuevamente.');
        return;
    }

    try {
        //const response = await registerObra(token, formData);
        await registerObra(token, formData);
         // También podríamos mostrar el ID u otros datos devueltos por el servidor
        // console.log('ID de la obra creada:', response.id);
        setMessage('Obra registrada exitosamente');
        setFormData({
            nombre: '',
            centroCosto: ''
        });
        setError('');
    } catch (err) {
        setError(err.message || 'Error al registrar la obra');
        setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="max-w-md mx-auto"> {/* Añadido para mejor centrado */}
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Registro de Obra
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa los datos de la nueva obra
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre de la Obra
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ingrese el nombre de la obra"
                />
              </div>

              <div>
                <label htmlFor="centroCosto" className="block text-sm font-medium text-gray-700">
                  Centro de Costo
                </label>
                <input
                  id="centroCosto"
                  name="centroCosto"
                  type="text"
                  required
                  value={formData.centroCosto}
                  onChange={handleChange}
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ingrese el centro de costo"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Registrar Obra
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 p-4 rounded-md bg-green-50">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 rounded-md bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterObra;