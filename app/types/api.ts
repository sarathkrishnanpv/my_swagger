export interface ApiParameter {
    name: string;
    in: 'path' | 'query' | 'header' | 'body';
    type: string;
    required: boolean;
    description?: string;
    example?: string;
}

export interface ApiEndpoint {
    id: string;
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    category: string;
    description?: string;
    parameters?: ApiParameter[];
    requestBody?: any;
    responseSchema?: any;
}

export interface ApiResponse {
    status: number;
    statusText: string;
    data: any;
    headers: Record<string, string>;
    time: number;
    size: number;
}
