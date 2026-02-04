import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    user: User;
}

export const authService = {
    async signup(credentials: SignupCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/signup', credentials);
        return response.data;
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    async getProfile(): Promise<ProfileResponse> {
        const response = await api.get<ProfileResponse>('/me');
        return response.data;
    },

    async updateProfile(data: { name?: string; email?: string }): Promise<ProfileResponse> {
        const response = await api.put<ProfileResponse>('/me', data);
        return response.data;
    },

    async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
        const response = await api.put('/auth/password', data);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    getUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setAuth(token: string, user: User) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
};
