// Modelos de datos globales

// Interfaces para usuarios
export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
}

// Interfaces para reservas
export interface Reservation {
    id: string;
    userId: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
    updatedAt?: string;
}