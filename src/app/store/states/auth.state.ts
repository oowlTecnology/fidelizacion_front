import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AuthActions } from '../actions/auth.actions';
import { AuthState, AppState } from '../models/app-state.model';
import { User, LoginResponse, LoginRequest } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@State<AuthState>({
  name: 'auth',
  defaults: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }
})
@Injectable()
export class AuthStateClass {
  constructor(private authService: AuthService) {}
  @Selector()
  static user(state: AuthState): User | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthState): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static token(state: AuthState): string | null {
    return state.token;
  }

  @Selector()
  static loading(state: AuthState): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: AuthState): string | null {
    return state.error;
  }

  @Action({ type: AuthActions.login })
  login(ctx: StateContext<AuthState>, action: { credentials: LoginRequest }) {
    ctx.patchState({ loading: true, error: null });
    
    this.authService.login(action.credentials).subscribe({
      next: (response: LoginResponse) => {
        ctx.dispatch({ type: AuthActions.loginSuccess, response });
      },
      error: (error: any) => {
        ctx.dispatch({ type: AuthActions.loginFailure, error: error.message || 'Error de autenticación' });
      }
    });
  }

  @Action({ type: AuthActions.loginSuccess })
  loginSuccess(ctx: StateContext<AuthState>, action: { response: LoginResponse }) {
    const { response } = action;
    ctx.patchState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      loading: false,
      error: null
    });
  }

  @Action({ type: AuthActions.loginFailure })
  loginFailure(ctx: StateContext<AuthState>, action: { error: string }) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action({ type: AuthActions.logout })
  logout(ctx: StateContext<AuthState>) {
    ctx.patchState({ loading: true });
  }

  @Action({ type: AuthActions.logoutSuccess })
  logoutSuccess(ctx: StateContext<AuthState>) {
    ctx.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  }

  @Action({ type: AuthActions.setUser })
  setUser(ctx: StateContext<AuthState>, action: { user: User }) {
    ctx.patchState({ user: action.user });
  }

  @Action({ type: AuthActions.clearUser })
  clearUser(ctx: StateContext<AuthState>) {
    ctx.patchState({ user: null, isAuthenticated: false });
  }

  @Action({ type: AuthActions.setToken })
  setToken(ctx: StateContext<AuthState>, action: { token: string }) {
    ctx.patchState({ token: action.token });
  }

  @Action({ type: AuthActions.clearToken })
  clearToken(ctx: StateContext<AuthState>) {
    ctx.patchState({ token: null });
  }

  @Action({ type: AuthActions.setLoading })
  setLoading(ctx: StateContext<AuthState>, action: { loading: boolean }) {
    ctx.patchState({ loading: action.loading });
  }

  @Action({ type: AuthActions.setError })
  setError(ctx: StateContext<AuthState>, action: { error: string | null }) {
    ctx.patchState({ error: action.error });
  }
}
