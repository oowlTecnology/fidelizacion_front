import { User } from '../../core/models/user.model';

export interface AppState {
  auth: AuthState;
  users: UsersState;
  dashboard: DashboardState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardState {
  stats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalRevenue: number;
  };
  loading: boolean;
  error: string | null;
}
