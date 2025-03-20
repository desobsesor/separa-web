import axios from 'axios';
import config from '../config/env.json';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const API_URL = config.development.apiBaseUrl || 'http://localhost:3001/api';

// Función para guardar el token en localStorage
const setToken = (token: string) => {
    localStorage.setItem('auth_token', token);
};

// Función para obtener el token de localStorage
export const getToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// Función para eliminar el token de localStorage
export const removeToken = (): void => {
    localStorage.removeItem('auth_token');
};

// Servicio de login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        const { token, user } = response.data;

        // Guardar el token en localStorage
        setToken(token);

        return { token, user };
    } catch (error) {
        throw error;
    }
};

// Servicio de registro
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        const { token, user } = response.data;

        // Guardar el token en localStorage
        setToken(token);

        return { token, user };
    } catch (error) {
        throw error;
    }
};

// Servicio para cerrar sesión
export const logout = (): void => {
    removeToken();
};

// Servicio para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Servicio para recuperar contraseña
export const forgotPassword = async (email: string): Promise<void> => {
    try {
        await axios.post(`${API_URL}/auth/forgot-password`, { email });
    } catch (error) {
        throw error;
    }
};

// Servicio para restablecer contraseña
export const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
        await axios.post(`${API_URL}/auth/reset-password`, { token, password });
    } catch (error) {
        throw error;
    }
};