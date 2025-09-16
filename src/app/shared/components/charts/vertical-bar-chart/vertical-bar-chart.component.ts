import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartjsCanvasDirective } from '../chartjs-canvas.directive';

@Component({
  selector: 'app-vertical-bar-chart',
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
export class VerticalBarChartComponent implements OnInit {
  public chartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        data: [200, 400, 600, 800, 1000, 1300, 1600, 1800, 2000],
        backgroundColor: '#2563eb',
        hoverBackgroundColor: '#2563eb',
        borderColor: '#2563eb',
        borderWidth: 1,
        label: ''
      }
    ]
  };

  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Sin leyenda visible
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
    }
  };

  constructor() { }

  ngOnInit(): void {
  }
}
