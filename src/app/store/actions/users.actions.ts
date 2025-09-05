import { User } from '../../core/models/user.model';

export class UsersActions {
  // Load Users
  static readonly loadUsers = '[Users] Load Users';
  static readonly loadUsersSuccess = '[Users] Load Users Success';
  static readonly loadUsersFailure = '[Users] Load Users Failure';

  // Create User
  static readonly createUser = '[Users] Create User';
  static readonly createUserSuccess = '[Users] Create User Success';
  static readonly createUserFailure = '[Users] Create User Failure';

  // Update User
  static readonly updateUser = '[Users] Update User';
  static readonly updateUserSuccess = '[Users] Update User Success';
  static readonly updateUserFailure = '[Users] Update User Failure';

  // Delete User
  static readonly deleteUser = '[Users] Delete User';
  static readonly deleteUserSuccess = '[Users] Delete User Success';
  static readonly deleteUserFailure = '[Users] Delete User Failure';

  // Select User
  static readonly selectUser = '[Users] Select User';

  // Loading
  static readonly setLoading = '[Users] Set Loading';

  // Error
  static readonly setError = '[Users] Set Error';
}
