import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { DashboardActions } from '../../../../store/actions/dashboard.actions';
import { BarChartComponent } from '../../../../shared/components/charts/bar-chart/bar-chart.component';
// import { LineChartComponent } from '../../../../shared/components/charts/line-chart/line-chart.component';
import { PieChartComponent } from '../../../../shared/components/charts/pie-chart/pie-chart.component';
import { AreaChartComponent } from '../../../../shared/components/charts/area-chart/area-chart.component';
import { VerticalBarChartComponent } from '../../../../shared/components/charts/vertical-bar-chart/vertical-bar-chart.component';
import { GroupedBarChartComponent } from '../../../../shared/components/charts/grouped-bar-chart/grouped-bar-chart.component';
import { DASHBOARD_CHARTS } from '../../../../shared/components/charts/mock-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BarChartComponent,
    // LineChartComponent,
    PieChartComponent,
    AreaChartComponent,
    // VerticalBarChartComponent,
    // GroupedBarChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalRevenue: 0
  };
  chartData = DASHBOARD_CHARTS;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loadStats();
    this.subscribeToState();
  }

  private loadStats(): void {
    this.store.dispatch({ type: DashboardActions.loadStats });
  }

  private subscribeToState(): void {
    this.store.select(state => state.dashboard).subscribe(dashboardState => {
      this.loading = dashboardState.loading;
      this.error = dashboardState.error;
      this.stats = dashboardState.stats;
    });
  }
}
