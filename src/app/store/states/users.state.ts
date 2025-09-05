import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { UsersActions } from '../actions/users.actions';
import { UsersState, AppState } from '../models/app-state.model';
import { User } from '../../core/models/user.model';
import { UsersService } from '../../features/users/services/users.service';

@State<UsersState>({
  name: 'users',
  defaults: {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  }
})
@Injectable()
export class UsersStateClass {
  constructor(private usersService: UsersService) {}
  @Selector()
  static users(state: UsersState): User[] {
    return state.users;
  }

  @Selector()
  static selectedUser(state: UsersState): User | null {
    return state.selectedUser;
  }

  @Selector()
  static loading(state: UsersState): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: UsersState): string | null {
    return state.error;
  }

  @Selector()
  static pagination(state: UsersState) {
    return state.pagination;
  }

  @Action({ type: UsersActions.loadUsers })
  loadUsers(ctx: StateContext<UsersState>, action: { page?: number; limit?: number }) {
    ctx.patchState({ loading: true, error: null });
    
    const page = action.page || 1;
    const limit = action.limit || 10;
    
    this.usersService.getUsers(page, limit).subscribe({
      next: (response: { users: User[]; pagination: any }) => {
        ctx.dispatch({ type: UsersActions.loadUsersSuccess, users: response.users, pagination: response.pagination });
      },
      error: (error: any) => {
        ctx.dispatch({ type: UsersActions.loadUsersFailure, error: error.message });
      }
    });
  }

  @Action({ type: UsersActions.loadUsersSuccess })
  loadUsersSuccess(ctx: StateContext<UsersState>, action: { users: User[]; pagination: any }) {
    const { users, pagination } = action;
    ctx.patchState({
      users,
      pagination,
      loading: false,
      error: null
    });
  }

  @Action({ type: UsersActions.loadUsersFailure })
  loadUsersFailure(ctx: StateContext<UsersState>, action: { error: string }) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action({ type: UsersActions.createUser })
  createUser(ctx: StateContext<UsersState>) {
    ctx.patchState({ loading: true, error: null });
  }

  @Action({ type: UsersActions.createUserSuccess })
  createUserSuccess(ctx: StateContext<UsersState>, action: { user: User }) {
    const state = ctx.getState();
    ctx.patchState({
      users: [...state.users, action.user],
      loading: false,
      error: null
    });
  }

  @Action({ type: UsersActions.createUserFailure })
  createUserFailure(ctx: StateContext<UsersState>, action: { error: string }) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action({ type: UsersActions.updateUser })
  updateUser(ctx: StateContext<UsersState>) {
    ctx.patchState({ loading: true, error: null });
  }

  @Action({ type: UsersActions.updateUserSuccess })
  updateUserSuccess(ctx: StateContext<UsersState>, action: { user: User }) {
    const state = ctx.getState();
    const updatedUsers = state.users.map(user => 
      user.id === action.user.id ? action.user : user
    );
    ctx.patchState({
      users: updatedUsers,
      loading: false,
      error: null
    });
  }

  @Action({ type: UsersActions.updateUserFailure })
  updateUserFailure(ctx: StateContext<UsersState>, action: { error: string }) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action({ type: UsersActions.deleteUser })
  deleteUser(ctx: StateContext<UsersState>) {
    ctx.patchState({ loading: true, error: null });
  }

  @Action({ type: UsersActions.deleteUserSuccess })
  deleteUserSuccess(ctx: StateContext<UsersState>, action: { id: string }) {
    const state = ctx.getState();
    const filteredUsers = state.users.filter(user => user.id !== action.id);
    ctx.patchState({
      users: filteredUsers,
      loading: false,
      error: null
    });
  }

  @Action({ type: UsersActions.deleteUserFailure })
  deleteUserFailure(ctx: StateContext<UsersState>, action: { error: string }) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  @Action({ type: UsersActions.selectUser })
  selectUser(ctx: StateContext<UsersState>, action: { user: User | null }) {
    ctx.patchState({ selectedUser: action.user });
  }

  @Action({ type: UsersActions.setLoading })
  setLoading(ctx: StateContext<UsersState>, action: { loading: boolean }) {
    ctx.patchState({ loading: action.loading });
  }

  @Action({ type: UsersActions.setError })
  setError(ctx: StateContext<UsersState>, action: { error: string | null }) {
    ctx.patchState({ error: action.error });
  }
}
