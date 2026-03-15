export interface APIError {
    code: string;
    field?: string;
    detail: string;
}

export interface ApiResponse<T> {
    results: T;
    count: number;
    next: string | null;
    previous: string | null;
    errors: APIError | null;
    isLoading: boolean;
}