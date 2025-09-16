import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';
import { GroupedBarChartComponent } from './grouped-bar-chart/grouped-bar-chart.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxChartsModule,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    AreaChartComponent,
    VerticalBarChartComponent,
    GroupedBarChartComponent
  ],
  exports: [
    NgxChartsModule,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    AreaChartComponent,
    VerticalBarChartComponent,
    GroupedBarChartComponent
  ]
})
export class ChartsModule { }

