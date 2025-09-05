export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  statusCode: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  statusCode: number;
}
