import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { DashboardActions } from '../../../../store/actions/dashboard.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
