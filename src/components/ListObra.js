import React, { useEffect, useState } from 'react';
import { getObras, deleteObra } from '../services/obraService';
import Navbar from './NavBar';

const ListObra = () => {
  const [obras, setObras] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObraId, setSelectedObraId] = useState(null);

  useEffect(() => {
    const fetchObras = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No se encontró un token. Inicia sesión nuevamente.');
        return;
      }

      try {
        const data = await getObras(token);
        setObras(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Error al obtener las obras');
      }
    };

    fetchObras();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedObraId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedObraId(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    
    try {
      await deleteObra(selectedObraId, token);
      setObras(obras.filter((obra) => obra.id !== selectedObraId));
      closeModal();
    } catch (err) {
      setError(err.message || 'Error al eliminar la obra');
    }
  };

  const handleEdit = (id) => {
    // Aquí irá la lógica de edición
    console.log('Editar obra:', id);
  };

  // Modal de confirmación
  const DeleteConfirmationModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-80 sm:w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
              Confirmar eliminación
            </h3>
            <div className="mt-2 px-4 sm:px-7 py-3">
              <p className="text-sm text-gray-500">
                ¿Estás seguro de que deseas eliminar esta obra? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Tarjeta para vista móvil
  const ObraCard = ({ obra }) => (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-500">Nombre de la Obra</p>
            <p className="text-sm text-gray-900">{obra.nombre}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-500">Centro de Costo</p>
            <p className="text-sm text-gray-900">{obra.centroCosto}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => handleEdit(obra.id)}
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
            onClick={() => openDeleteModal(obra.id)}
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
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="mt-2 lg:mt-6 text-2xl lg:text-3xl font-bold text-gray-900 text-center">
              Lista de Obras
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Aquí puedes ver todas las obras registradas
            </p>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-md bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Vista móvil: Tarjetas */}
          <div className="lg:hidden mt-6">
            {obras.map((obra) => (
              <ObraCard key={obra.id} obra={obra} />
            ))}
          </div>

          {/* Vista desktop: Tabla */}
          <div className="hidden lg:block mt-8">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre de la Obra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Centro de Costo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {obras.map((obra) => (
                    <tr key={obra.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {obra.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {obra.centroCosto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex justify-end items-center space-x-3">
                          <button
                            onClick={() => handleEdit(obra.id)}
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
                            onClick={() => openDeleteModal(obra.id)}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal />
    </div>
  );
};

export default ListObra;