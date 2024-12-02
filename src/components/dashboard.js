import React, { useState, useEffect } from 'react';
import { getEntradas } from '../services/asistenciaService';
import Navbar from './NavBar';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

// Registramos los componentes necesarios para Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const Dashboard = () => {
  const [entradas, setEntradas] = useState([]);
  const [error, setError] = useState('');

  // Usamos useEffect para obtener las entradas cuando el componente se monta
  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const token = localStorage.getItem('token'); // Asegúrate de reemplazarlo con el token real
        const data = await getEntradas(token);
        setEntradas(data);
      } catch (err) {
        setError('Error al obtener las entradas');
      }
    };
    fetchEntradas();
  }, []);

  // Procesamos los datos para el gráfico de barras (Entradas por obra)
  const processBarChartData = () => {
    const obras = {};
    entradas.forEach((entrada) => {
      const obra = entrada.nombreObra;
      if (obras[obra]) {
        obras[obra]++;
      } else {
        obras[obra] = 1;
      }
    });

    const labels = Object.keys(obras);
    const data = Object.values(obras);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Entradas por Obra',
          data: data,
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          borderWidth: 1,
        },
      ],
    };
  };

  // Procesamos los datos para el gráfico de torta (Entradas por Usuario)
  const processPieChartData = () => {
    const usuarios = {};
    entradas.forEach((entrada) => {
      const usuario = entrada.nombre;
      if (usuarios[usuario]) {
        usuarios[usuario]++;
      } else {
        usuarios[usuario] = 1;
      }
    });

    const labels = Object.keys(usuarios);
    const data = Object.values(usuarios);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Entradas por Usuario',
          data: data,
          backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFFF33'],
        },
      ],
    };
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        {error && <div className="text-red-500">{error}</div>}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Reporte de Asistencias</h2>
          
          {/* Título y gráfico de barras: Entradas por Obra */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-semibold mb-2">Entradas por Obra</h3>
            <div style={{ height: '300px' }}> {/* Contenedor con altura fija */}
              <Bar
                data={processBarChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Permite ajustar la altura y el ancho
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                    y: {
                      ticks: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }}
                height={300} // Establecemos un tamaño fijo para la altura
              />
            </div>
          </div>

          {/* Título y gráfico de torta: Entradas por Usuario */}
          <div className="w-full max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Entradas por Usuario</h3>
            <div style={{ height: '300px' }}> {/* Contenedor con altura fija */}
              <Pie
                data={processPieChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          return `${tooltipItem.label}: ${tooltipItem.raw} entradas`;
                        },
                      },
                    },
                  },
                }}
                height={300} // Establecemos un tamaño fijo para la altura
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
