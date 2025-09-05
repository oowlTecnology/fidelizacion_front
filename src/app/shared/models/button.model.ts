export type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonConfig {
  type: ButtonType;
  size: ButtonSize;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
}
