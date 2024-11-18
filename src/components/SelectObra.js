import React, { useEffect, useState } from 'react';
import { getObras, getCentroCostoByNameObra } from '../services/obraService';
import Navbar from './NavBar';

const ObraSelector = () => {
  const [obras, setObras] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [centrosCosto, setCentrosCosto] = useState([]);
  const [selectedObra, setSelectedObra] = useState({
    nombre: '',
    centroCosto: ''
  });

  // Obtener la lista de obras al cargar el componente
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró un token. Inicia sesión nuevamente.');
          return;
        }
        const data = await getObras(token);
        setObras(data);
      } catch (err) {
        setError('Error al cargar las obras');
      }
    };

    fetchObras();
  }, []);

  // Obtener lista única de nombres
  const nombresUnicos = [...new Set(obras.map(obra => obra.nombre))];

  // Función para cargar los centros de costo cuando se selecciona un nombre
  const handleNombreChange = async (e) => {
    const nombreSeleccionado = e.target.value;
    setSelectedObra(prev => ({
      ...prev,
      nombre: nombreSeleccionado,
      centroCosto: '' // Resetear el centro de costo seleccionado
    }));

    if (nombreSeleccionado) {
      try {
        const token = localStorage.getItem('token');
        const centrosCostoData = await getCentroCostoByNameObra(nombreSeleccionado, token);
        setCentrosCosto(centrosCostoData);
        setError('');
      } catch (err) {
        setError('Error al cargar los centros de costo');
        setCentrosCosto([]);
      }
    } else {
      setCentrosCosto([]);
    }
  };

  const handleCentroCostoChange = (e) => {
    setSelectedObra(prev => ({
      ...prev,
      centroCosto: e.target.value
    }));
  };

  const handleGuardar = () => {
    if (!selectedObra.nombre || !selectedObra.centroCosto) {
      setError('Por favor selecciona tanto el nombre como el centro de costo');
      return;
    }

    try {
      localStorage.setItem('obra', JSON.stringify(selectedObra));
      setMessage('Selección guardada exitosamente');
      setError('');
    } catch (err) {
      setError('Error al guardar la selección');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="max-w-md mx-auto">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Selección de Obra
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Selecciona el nombre y centro de costo de la obra
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre de la Obra
                </label>
                <select
                  id="nombre"
                  value={selectedObra.nombre}
                  onChange={handleNombreChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Selecciona un nombre</option>
                  {nombresUnicos.map((nombre) => (
                    <option key={nombre} value={nombre}>
                      {nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="centroCosto" className="block text-sm font-medium text-gray-700">
                  Centro de Costo
                </label>
                <select
                  id="centroCosto"
                  value={selectedObra.centroCosto}
                  onChange={handleCentroCostoChange}
                  disabled={!selectedObra.nombre}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Selecciona un centro de costo</option>
                  {centrosCosto.map((centroCosto) => (
                    <option key={centroCosto} value={centroCosto}>
                      {centroCosto}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                onClick={handleGuardar}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar Selección
              </button>
            </div>
          </div>

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

export default ObraSelector;