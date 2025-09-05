import { User, LoginRequest, LoginResponse } from '../../core/models/user.model';

export class AuthActions {
  // Login
  static readonly login = '[Auth] Login';
  static readonly loginSuccess = '[Auth] Login Success';
  static readonly loginFailure = '[Auth] Login Failure';

  // Logout
  static readonly logout = '[Auth] Logout';
  static readonly logoutSuccess = '[Auth] Logout Success';

  // User
  static readonly setUser = '[Auth] Set User';
  static readonly clearUser = '[Auth] Clear User';

  // Token
  static readonly setToken = '[Auth] Set Token';
  static readonly clearToken = '[Auth] Clear Token';

  // Loading
  static readonly setLoading = '[Auth] Set Loading';

  // Error
  static readonly setError = '[Auth] Set Error';
}
