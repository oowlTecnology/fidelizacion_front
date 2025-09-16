// Tipos de datos para los gráficos
export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  name: string;
  series: Array<{
    name: string;
    value: number;
  }>;
}

export interface PieChartData {
  name: string;
  value: number;
}

export interface BarChartData {
  name: string;
  value: number;
}

export interface AreaChartData {
  name: string;
  series: Array<{
    name: string;
    value: number;
  }>;
}

// Configuraciones de colores para los gráficos
export const CHART_COLORS = {
  primary: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A'],
  success: ['#10B981', '#059669', '#047857', '#065F46'],
  warning: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
  danger: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
  info: ['#06B6D4', '#0891B2', '#0E7490', '#155E75']
};

// Configuraciones por defecto para los gráficos
export const CHART_CONFIG = {
  animations: true,
  showLegend: true,
  showLabels: true,
  showXAxis: true,
  showYAxis: true,
  showXAxisLabel: true,
  showYAxisLabel: true,
  xAxisLabel: 'Categoría',
  yAxisLabel: 'Valor',
  timeline: false,
  gradient: false,
  showDataLabel: false,
  colorScheme: {
    domain: CHART_COLORS.primary
  }
};

