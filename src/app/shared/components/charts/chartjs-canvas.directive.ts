import { Directive, ElementRef, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

@Directive({
  selector: '[chartjsCanvas]',
  standalone: true
})
export class ChartjsCanvasDirective implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() chartjsCanvasData!: ChartData;
  @Input() chartjsCanvasOptions!: ChartOptions;
  @Input() chartjsCanvasType: string = 'bar';

  private chart: Chart | null = null;

  constructor(private elementRef: ElementRef<HTMLCanvasElement>) {}

  ngOnInit(): void {
    // Esperar a que el elemento esté disponible
  }

  ngAfterViewInit(): void {
    // Crear el gráfico después de que la vista esté inicializada
    setTimeout(() => {
      this.createChart();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && (changes['chartjsCanvasData'] || changes['chartjsCanvasOptions'])) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private createChart(): void {
    if (!this.chartjsCanvasData || !this.chartjsCanvasOptions) {
      console.warn('Chart data or options not available');
      return;
    }

    // Destruir gráfico existente si existe
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    try {
      const config: ChartConfiguration = {
        type: this.chartjsCanvasType as any,
        data: this.chartjsCanvasData,
        options: {
          ...this.chartjsCanvasOptions,
          responsive: true,
          maintainAspectRatio: false
        }
      };

      this.chart = new Chart(this.elementRef.nativeElement, config);
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  private updateChart(): void {
    if (this.chart && this.chartjsCanvasData && this.chartjsCanvasOptions) {
      try {
        this.chart.data = this.chartjsCanvasData;
        this.chart.options = {
          ...this.chartjsCanvasOptions,
          responsive: true,
          maintainAspectRatio: false
        };
        this.chart.update();
      } catch (error) {
        console.error('Error updating chart:', error);
      }
    }
  }
}
