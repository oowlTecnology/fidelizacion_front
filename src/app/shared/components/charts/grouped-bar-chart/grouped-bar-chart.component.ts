import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartjsCanvasDirective } from '../chartjs-canvas.directive';

@Component({
  selector: 'app-grouped-bar-chart',
  standalone: true,
  imports: [ChartjsCanvasDirective],
  template: `
    <div class="chart-container">
      <canvas 
        chartjsCanvas
        [chartjsCanvasData]="chartData"
        [chartjsCanvasOptions]="chartOptions"
        chartjsCanvasType="bar">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      height: 400px;
      width: 100%;
    }
  `]
})
export class GroupedBarChartComponent implements OnInit {
  public chartData: ChartData<'bar'> = {
    labels: ['Ene', 'Abr', 'Oct'],
    datasets: [
      {
        label: 'Registros',
        data: [120, 90, 150],
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
        borderWidth: 1,
        hoverBackgroundColor: '#1d4ed8',
        hoverBorderColor: '#1d4ed8'
      },
      {
        label: 'Aportes',
        data: [80, 100, 120],
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
        borderWidth: 1,
        hoverBackgroundColor: '#dc2626',
        hoverBorderColor: '#dc2626'
      }
    ]
  };

  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' // Leyenda abajo
      }
    },
    scales: {
      y: {
        beginAtZero: true, // Eje Y iniciando en cero
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#666'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  constructor() { }

  ngOnInit(): void {
  }
}
