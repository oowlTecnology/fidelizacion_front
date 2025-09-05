export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

export interface FormConfig {
  fields: FormField[];
  submitText: string;
  cancelText?: string;
}
