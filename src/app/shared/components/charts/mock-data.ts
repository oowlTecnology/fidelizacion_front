import { BarChartData, LineChartData, PieChartData, AreaChartData } from './chart-types';

// Datos de ejemplo para gráfico de barras
export const MOCK_BAR_DATA: BarChartData[] = [
  { name: 'Enero', value: 120 },
  { name: 'Febrero', value: 150 },
  { name: 'Marzo', value: 180 },
  { name: 'Abril', value: 200 },
  { name: 'Mayo', value: 160 },
  { name: 'Junio', value: 220 }
];

// Datos de ejemplo para gráfico de líneas
export const MOCK_LINE_DATA: LineChartData[] = [
  {
    name: 'Ventas',
    series: [
      { name: 'Enero', value: 120 },
      { name: 'Febrero', value: 150 },
      { name: 'Marzo', value: 180 },
      { name: 'Abril', value: 200 },
      { name: 'Mayo', value: 160 },
      { name: 'Junio', value: 220 }
    ]
  },
  {
    name: 'Gastos',
    series: [
      { name: 'Enero', value: 80 },
      { name: 'Febrero', value: 100 },
      { name: 'Marzo', value: 120 },
      { name: 'Abril', value: 140 },
      { name: 'Mayo', value: 110 },
      { name: 'Junio', value: 160 }
    ]
  }
];

// Datos de ejemplo para gráfico circular
export const MOCK_PIE_DATA: PieChartData[] = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 20 }
];

// Datos de ejemplo para gráfico de área
export const MOCK_AREA_DATA: AreaChartData[] = [
  {
    name: 'Usuarios Activos',
    series: [
      { name: 'Enero', value: 1000 },
      { name: 'Febrero', value: 1200 },
      { name: 'Marzo', value: 1500 },
      { name: 'Abril', value: 1800 },
      { name: 'Mayo', value: 1600 },
      { name: 'Junio', value: 2000 }
    ]
  },
  {
    name: 'Usuarios Nuevos',
    series: [
      { name: 'Enero', value: 200 },
      { name: 'Febrero', value: 300 },
      { name: 'Marzo', value: 400 },
      { name: 'Abril', value: 500 },
      { name: 'Mayo', value: 450 },
      { name: 'Junio', value: 600 }
    ]
  }
];

// Datos específicos para el dashboard
export const DASHBOARD_CHARTS = {
  // Gráfico de usuarios por mes
  usersByMonth: MOCK_BAR_DATA,
  
  // Gráfico de ingresos vs gastos
  revenueVsExpenses: MOCK_LINE_DATA,
  
  // Distribución de dispositivos
  deviceDistribution: MOCK_PIE_DATA,
  
  // Crecimiento de usuarios
  userGrowth: MOCK_AREA_DATA
};

