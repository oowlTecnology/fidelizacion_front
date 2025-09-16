import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LineChartData, CHART_CONFIG } from '../chart-types';

@Component({
  selector: 'app-line-chart',
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
        <ngx-charts-line-chart
          [results]="data"
          [scheme]="colorScheme"
          [animations]="animations"
          [showXAxisLabel]="showXAxisLabel"
          [showYAxisLabel]="showYAxisLabel"
          [xAxisLabel]="xAxisLabel"
          [yAxisLabel]="yAxisLabel"
          [gradient]="gradient"
          [timeline]="timeline"
          [curve]="curve"
          [autoScale]="autoScale">
        </ngx-charts-line-chart>
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
export class LineChartComponent implements OnInit {
  @Input() title: string = 'Gráfico de Líneas';
  @Input() subtitle?: string;
  @Input() data: LineChartData[] = [];
  @Input() height: number = 400;
  @Input() colorScheme: any = CHART_CONFIG.colorScheme;
  @Input() animations: boolean = CHART_CONFIG.animations;
  @Input() showXAxisLabel: boolean = CHART_CONFIG.showXAxisLabel;
  @Input() showYAxisLabel: boolean = CHART_CONFIG.showYAxisLabel;
  @Input() xAxisLabel: string = CHART_CONFIG.xAxisLabel;
  @Input() yAxisLabel: string = CHART_CONFIG.yAxisLabel;
  @Input() gradient: boolean = CHART_CONFIG.gradient;
  @Input() timeline: boolean = CHART_CONFIG.timeline;
  @Input() curve: any = 'linear';
  @Input() autoScale: boolean = true;

  ngOnInit(): void {
    // Validar que los datos estén en el formato correcto
    if (this.data.length === 0) {
      console.warn('LineChartComponent: No se proporcionaron datos');
    }
  }
}
