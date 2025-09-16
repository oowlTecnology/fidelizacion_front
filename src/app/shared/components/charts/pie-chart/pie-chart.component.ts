import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartData, CHART_CONFIG } from '../chart-types';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container">
      <div class="chart-header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        @if (subtitle) {
          <p class="text-sm text-gray-600">{{ subtitle }}</p>
        }
      </div>
      
      <div class="chart-content" [style.height.px]="height">
        <ngx-charts-pie-chart
          [results]="data"
          [scheme]="colorScheme"
          [animations]="animations"
          [gradient]="gradient"
          [tooltipDisabled]="tooltipDisabled"
          [legendTitle]="legendTitle"
          [doughnut]="doughnut"
          [arcWidth]="arcWidth">
        </ngx-charts-pie-chart>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
    }
    
    .chart-header {
      @apply mb-4;
    }
    
    .chart-content {
      @apply w-full;
    }
  `]
})
export class PieChartComponent implements OnInit {
  @Input() title: string = 'Gráfico Circular';
  @Input() subtitle?: string;
  @Input() data: PieChartData[] = [];
  @Input() height: number = 400;
  @Input() colorScheme: any = CHART_CONFIG.colorScheme;
  @Input() animations: boolean = CHART_CONFIG.animations;
  @Input() gradient: boolean = CHART_CONFIG.gradient;
  @Input() tooltipDisabled: boolean = false;
  @Input() legendTitle: string = 'Leyenda';
  @Input() doughnut: boolean = false;
  @Input() arcWidth: number = 0.25;

  ngOnInit(): void {
    // Validar que los datos estén en el formato correcto
    if (this.data.length === 0) {
      console.warn('PieChartComponent: No se proporcionaron datos');
    }
  }
}
