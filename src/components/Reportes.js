import React, { useState, useEffect } from 'react';
import { obtenerFechas, obtenerObras, filtrarEntrada } from '../services/reportesServices';
import * as XLSX from 'xlsx';
import Navbar from './NavBar';

const ReporteAsistencias = () => {
  const [fechas, setFechas] = useState([]);
  const [obras, setObras] = useState([]);
  const [selectedFecha, setSelectedFecha] = useState('');
  const [selectedObra, setSelectedObra] = useState('');
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró un token. Inicia sesión nuevamente.');
          return;
        }

        const fechasObtenidas = await obtenerFechas(token);
        const obrasObtenidas = await obtenerObras(token);

        setFechas(fechasObtenidas);
        setObras(obrasObtenidas);
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
      }
    };

    cargarDatos();
  }, []);

  const handleGenerarReporte = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Validar que se hayan seleccionado fecha y obra
      if (!selectedFecha || !selectedObra) {
        setError('Debe seleccionar tanto una fecha como una obra');
        return;
      }

      const filtroData = {
        fecha: selectedFecha,
        nombreObra: selectedObra
      };

      const resultadosFiltrados = await filtrarEntrada(token, filtroData);
      setResultados(resultadosFiltrados);
      
      // Generar Excel
      generarExcel(resultadosFiltrados);
    } catch (err) {
      setError(err.message || 'Error al generar el reporte');
    }
  };

  const generarExcel = (datos) => {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Convertir los datos a formato de hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(datos);
    
    // Añadir la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Asistencias');
    
    // Generar y descargar el archivo
    XLSX.writeFile(workbook, `Reporte_Asistencias_${selectedObra}_${selectedFecha}.xlsx`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Generar Reporte de Asistencias
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <select
                id="fecha"
                value={selectedFecha}
                onChange={(e) => setSelectedFecha(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Selecciona una fecha</option>
                {fechas.map((fecha) => (
                  <option key={fecha} value={fecha}>
                    {fecha}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="obra" className="block text-sm font-medium text-gray-700">
                Obra
              </label>
              <select
                id="obra"
                value={selectedObra}
                onChange={(e) => setSelectedObra(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Selecciona una obra</option>
                {obras.map((obra) => (
                  <option key={obra} value={obra}>
                    {obra}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerarReporte}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generar Reporte
            </button>
          </div>

          {resultados.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resultados del Reporte
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-200">
                      {Object.keys(resultados[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((resultado, index) => (
                      <tr key={index} className="border-b">
                        {Object.values(resultado).map((value, colIndex) => (
                          <td key={colIndex} className="px-4 py-2 text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReporteAsistencias;