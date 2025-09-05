import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { DashboardActions } from '../actions/dashboard.actions';
import { DashboardState, AppState } from '../models/app-state.model';
import { DashboardService } from '../../features/dashboard/services/dashboard.service';

@State<DashboardState>({
  name: 'dashboard',
  defaults: {
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      totalRevenue: 0
    },
    loading: false,
    error: null
  }
})
@Injectable()
export class DashboardStateClass {
  constructor(private dashboardService: DashboardService) {}
  @Selector()
  static stats(state: DashboardState) {
    return state.stats;
  }

  @Selector()
  static loading(state: DashboardState): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: DashboardState): string | null {
    return state.error;
  }

  @Action({ type: DashboardActions.loadStats })
  loadStats(ctx: StateContext<DashboardState>) {
    ctx.patchState({ loading: true, error: null });
    
    this.dashboardService.getStats().subscribe({
      next: (stats: any) => {
        ctx.dispatch({ type: DashboardActions.loadStatsSuccess, stats });
      },
      error: (error: any) => {
        ctx.dispatch({ type: DashboardActions.loadStatsFailure, error: error.message });
      }
    });
  }

  @Action({ type: DashboardActions.loadStatsSuccess })
  loadStatsSuccess(ctx: StateContext<DashboardState>, action: { stats: any }) {
    ctx.patchState({
      stats: action.stats,
      loading: false,
      error: null
    });
  }

  @Action({ type: DashboardActions.loadStatsFailure })
  loadStatsFailure(ctx: StateContext<DashboardState>, action: { error: string }) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action({ type: DashboardActions.setLoading })
  setLoading(ctx: StateContext<DashboardState>, action: { loading: boolean }) {
    ctx.patchState({ loading: action.loading });
  }

  @Action({ type: DashboardActions.setError })
  setError(ctx: StateContext<DashboardState>, action: { error: string | null }) {
    ctx.patchState({ error: action.error });
  }
}
