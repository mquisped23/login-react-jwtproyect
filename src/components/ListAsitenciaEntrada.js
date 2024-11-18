import React, { useEffect, useState } from 'react';
import { getEntradas, deleteAsistenciaEntrada } from '../services/asistenciaService';
import { MapPin } from 'lucide-react';
import Navbar from './NavBar';

const ListAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsistenciaId, setSelectedAsistenciaId] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchAsistencias = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No se encontró un token. Inicia sesión nuevamente.');
        return;
      }

      try {
        const data = await getEntradas(token);
        setAsistencias(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Error al obtener las asistencias');
      }
    };

    fetchAsistencias();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedAsistenciaId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsistenciaId(null);
  };

  const handleEdit = (id) => {
    // Aquí irá la lógica de edición
    console.log('Editar obra:', id);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    try {
      await deleteAsistenciaEntrada(selectedAsistenciaId, token);
      setAsistencias(asistencias.filter((asistencia) => asistencia.id !== selectedAsistenciaId));
      closeModal();
    } catch (err) {
      setError(err.message || 'Error al eliminar la asistencia');
    }
  };

  const handleShowLocation = (ubicacion) => {
    try {
      // Asumiendo que la ubicación viene en formato "latitud,longitud"
      const [lat, lng] = ubicacion.split(',').map(coord => parseFloat(coord.trim()));
      setSelectedLocation({ lat, lng });
      setShowMap(true);
    } catch (err) {
      setError('Error al procesar las coordenadas de ubicación');
    }
  };

  const DeleteConfirmationModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-80 sm:w-96 shadow-lg rounded-md bg-white">
          <div className="text-center">
            <div className="text-red-600">
              <h3 className="text-lg font-medium">Confirmar eliminación</h3>
              <p className="text-sm mt-2">
                ¿Estás seguro de que deseas eliminar esta asistencia? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MapComponent = ({ location }) => {
    useEffect(() => {
      // Cargar el script de Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD1J2VwA1pA-EXAMPLE-KEY123ABC`; // Reemplaza con tu API key
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }, [location]);

    const initializeMap = () => {
      const mapElement = document.getElementById('map');
      const map = new window.google.maps.Map(mapElement, {
        center: location,
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: location,
        map: map,
        title: 'Ubicación registrada'
      });
    };

    return <div id="map" className="w-full h-96 rounded-lg shadow-lg mt-4"></div>;
  };

  const ActionButtons = ({ asistencia }) => (
    <div className="flex justify-end items-center space-x-3">
      <button
        onClick={() => handleEdit(asistencia.id)}
        className="text-blue-600 hover:text-blue-900 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
      <button
        onClick={() => openDeleteModal(asistencia.id)}
        className="text-red-600 hover:text-red-900 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
      <button
        onClick={() => handleShowLocation(asistencia.ubicacion)}
        className="text-green-600 hover:text-green-900 focus:outline-none"
      >
        <MapPin className="h-5 w-5" />
      </button>
    </div>
  );

  const AsistenciaCard = ({ asistencia }) => (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-500">Obra</p>
          <p className="text-sm text-gray-900">{asistencia.nombreObra}</p>
          <p className="text-sm font-medium text-gray-500">Usuario</p>
          <p className="text-sm text-gray-900">{asistencia.nombre} - DNI: {asistencia.dni}</p>
          <p className="text-sm font-medium text-gray-500">Hora de Entrada</p>
          <p className="text-sm text-gray-900">{asistencia.horaEntrada}</p>
          <p className="text-sm font-medium text-gray-500">Fecha</p>
          <p className="text-sm text-gray-900">{asistencia.fecha}</p>
          <p className="text-sm font-medium text-gray-500">Ubicación</p>
          <p className="text-sm text-gray-900">{asistencia.ubicacion}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <ActionButtons asistencia={asistencia} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Lista de Asistencias</h2>
          <p className="text-center text-sm text-gray-600">
            Aquí puedes ver todas las asistencias registradas
          </p>

          {error && (
            <div className="mt-4 p-4 rounded-md bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Vista móvil */}
          <div className="lg:hidden mt-6">
            {asistencias.map((asistencia) => (
              <AsistenciaCard key={asistencia.id} asistencia={asistencia} />
            ))}
            {showMap && selectedLocation && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación en el mapa</h3>
                <MapComponent location={selectedLocation} />
              </div>
            )}
          </div>

          {/* Vista desktop */}
          <div className="hidden lg:block mt-8">
            <div className="overflow-x-auto">
              <table className="min-w-full max-w-screen-xl bg-white shadow rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Obra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Hora de Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {asistencias.map((asistencia) => (
                    <tr key={asistencia.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asistencia.nombreObra}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asistencia.nombre} - DNI: {asistencia.dni}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asistencia.horaEntrada}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asistencia.fecha}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asistencia.ubicacion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <ActionButtons asistencia={asistencia} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Sección del mapa */}
            {showMap && selectedLocation && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación en el mapa</h3>
                <MapComponent location={selectedLocation} />
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal />
    </div>
  );
};

export default ListAsistencias;