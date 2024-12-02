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

  // Cargar el script de Google Maps de manera dinámica
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCU-i4XsYc6TdBVsPINpI89uyPXmF7wrwI&v=beta&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      // Limpiar el script cuando el componente se desmonte
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

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

  const handleShowLocation = (ubicacion) => {
    try {
      const [lat, lng] = ubicacion.split(',').map(coord => parseFloat(coord.trim()));
      setSelectedLocation({ lat, lng });
      setShowMap(true);
    } catch (err) {
      setError('Error al procesar las coordenadas de ubicación');
    }
  };

  const MapComponent = ({ location }) => {
    useEffect(() => {
      if (window.google && location) {
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
      }
    }, [location]);

    return <div id="map" className="w-full h-96 rounded-lg shadow-lg mt-4"></div>;
  };

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

          <div className="overflow-x-auto bg-white rounded-lg shadow mb-4 p-4 max-h-[500px] overflow-y-auto md:max-h-[400px]">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-900">Nombre de la Obra</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-900">Nombre/DNI</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-900">Hora Entrada</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-900">Fecha</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-900">Ubicación</th>
                  <th className="px-4 py-2 text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((asistencia) => (
                  <tr key={asistencia.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{asistencia.nombreObra}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{asistencia.nombre} - DNI: {asistencia.dni}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{asistencia.horaEntrada}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{asistencia.fecha}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{asistencia.ubicacion}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <button
                        onClick={() => handleShowLocation(asistencia.ubicacion)}
                        className="text-green-600 hover:text-green-900 focus:outline-none"
                      >
                        <MapPin className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showMap && selectedLocation && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación en el mapa</h3>
              <MapComponent location={selectedLocation} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListAsistencias;
