const API_URL = import.meta.env.VITE_API_URL || '';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'An error occurred' }));
        throw new Error(error.error || 'API request failed');
    }

    return response.json();
};
