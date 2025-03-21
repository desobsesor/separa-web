"use client"

import React, { useState } from 'react';
import { createUser, CreateUserData } from '@/services/api';
import useUI from '@/context/UIContext';
import Card from '../ui/Card';
import { PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { StopIcon, WindowIcon } from '@heroicons/react/20/solid';
import { ChevronDoubleUpIcon } from '@heroicons/react/16/solid';

interface FormData {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    password: string;
    createdAt: Date;
}

interface ValidationErrors {
    name?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
}

interface TooltipProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ message, type, isVisible }) => {
    if (!isVisible) return null;

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    }[type];

    return (
        <div className={`absolute -top-2 transform ${bgColor} text-white px-3 py-1 rounded-md shadow-lg text-sm animate-fade-in`}>
            {message}
        </div>
    );
};

const NewUserForm: React.FC = () => {
    const { setUi } = useUI();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        password: '',
        createdAt: new Date(),
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });

    /**
     * Formats a phone number string into a standardized format
     * 
     * @param {string} value - The raw phone number input string
     * @returns {string} The formatted phone number in the format (XX) XXX-XXX-XXXX
     * 
     * @example
     * formatPhoneNumber('5712345678') - returns "(57) 123-456-78"
     * formatPhoneNumber('57') - returns "(57"
     * formatPhoneNumber('57123') - returns "(57) 123"
     */
    const formatPhoneNumber = (value: string): string => {
        const numbers = value.replace(/\D/g, '');

        if (numbers.length <= 2) {
            return `(${numbers}`;
        } else if (numbers.length <= 5) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        } else if (numbers.length <= 8) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 5)}-${numbers.slice(5)}`;
        } else if (numbers.length <= 12) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 5)}-${numbers.slice(5, 8)}-${numbers.slice(8, 12)}`;
        } else {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 5)}-${numbers.slice(5, 8)}-${numbers.slice(8, 12)}`;
        }
    };

    /**
     * Validates an email address string
     * 
     * @param {string} email - The email address to validate
     * @returns {boolean} True if the email is valid, false otherwise
     * 
     * @example
     * validateEmail('test@example.com') - returns true
     * validateEmail('invalid.email') - returns false
     */
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type, isVisible: true });

        setTimeout(() => {
            setNotification(prev => ({ ...prev, isVisible: false }));
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'phoneNumber') {
            setFormData(prev => ({
                ...prev,
                [name]: formatPhoneNumber(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (name === 'name' && value.trim() !== '' && !showAdditionalFields) {
            setShowAdditionalFields(true);
        }

        validateField(name, name === 'phoneNumber' ? formatPhoneNumber(value) : value);
    };

    const validateField = (name: string, value: string) => {
        let fieldErrors: ValidationErrors = { ...errors };

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    fieldErrors.name = 'El nombre es requerido';
                } else {
                    delete fieldErrors.name;
                }
                break;
            case 'phoneNumber':
                const digits = value.replace(/\D/g, '');
                if (digits.length < 11) {
                    fieldErrors.phoneNumber = 'El teléfono debe tener al menos 10 dígitos';
                } else {
                    delete fieldErrors.phoneNumber;
                }
                break;
            case 'email':
                if (!value.trim()) {
                    fieldErrors.email = 'El correo es requerido';
                } else if (!validateEmail(value)) {
                    fieldErrors.email = 'Ingrese un correo electrónico válido';
                } else {
                    delete fieldErrors.email;
                }
                break;
            case 'address':
                if (!value.trim()) {
                    fieldErrors.address = 'La dirección es requerida';
                } else {
                    delete fieldErrors.address;
                }
                break;
            default:
                break;
        }

        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    const validateForm = (): boolean => {
        const { name, phoneNumber, email, address } = formData;
        let isValid = true;
        let newErrors: ValidationErrors = {};

        if (!name.trim()) {
            newErrors.name = 'El nombre es requerido';
            isValid = false;
        }

        const phoneDigits = phoneNumber.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            newErrors.phoneNumber = 'El teléfono debe tener al menos 10 dígitos';
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = 'El correo es requerido';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Ingrese un correo electrónico válido';
            isValid = false;
        }

        if (!address.trim()) {
            newErrors.address = 'La dirección es requerida';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Por favor, corrija los errores en el formulario', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const userData: CreateUserData = {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                address: formData.address
            };

            await createUser(userData);
            setShowAdditionalFields(false);
            showNotification('Usuario creado exitosamente', 'success');
            setUi(userData);
            setFormData({
                name: '',
                phoneNumber: '',
                email: '',
                address: '',
                password: '',
                createdAt: new Date()
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            showNotification('Error al crear el usuario', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-w-full py-0 flex flex-col pt-8">
            <Card title="Nuevo usuario" className='mt-1 mx-2 px-2'>
                <div className="flex flex-col items-center">
                    <form onSubmit={handleSubmit} className="space-y-2 mx-0 min-w-full">
                        <div className="relative">
                            {errors.name && (
                                <Tooltip message={errors.name} type="error" isVisible={true} />
                            )}
                            <label htmlFor="name" className="-mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                placeholder="Nombre completo"
                            />
                        </div>

                        {showAdditionalFields && (
                            <div className="space-y-2 animate-fade-in transition-all duration-300">
                                <div className="relative grid grid-cols-1">
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                        placeholder="(57) 310-247-7988"
                                    />
                                    {errors.phoneNumber && (
                                        <Tooltip message={errors.phoneNumber} type="error" isVisible={true} />
                                    )}
                                </div>

                                <div className="relative">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Correo
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                        placeholder="correo@ejemplo.com"
                                    />
                                    {errors.email && (
                                        <Tooltip message={errors.email} type="error" isVisible={true} />
                                    )}
                                </div>

                                <div className="relative">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                        placeholder="Dirección completa"
                                    />
                                    {errors.address && (
                                        <Tooltip message={errors.address} type="error" isVisible={true} />
                                    )}
                                </div>
                                <div className="flex justify-end space-x-4 pt-2">
                                    <button
                                        type="button"
                                        className='relative flex p-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-500 hover:bg-gray-600 text-white bg-secondary hover:bg-secondary/90 focus:ring-secondary/50'
                                        onClick={() => {
                                            setFormData({
                                                name: '',
                                                phoneNumber: '',
                                                email: '',
                                                address: '',
                                                password: '',
                                                createdAt: new Date(),
                                            });
                                            setShowAdditionalFields(false);
                                            setErrors({});
                                        }}
                                    >
                                        <ChevronDoubleUpIcon className="h-5 w-5 mr-2 text-blue-50" />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="relative flex w-full cursor-pointer button-separa text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                                    >
                                        {!isSubmitting && <PlusIcon className="h-6 w-6 mr-2 text-white" />}
                                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </Card>
            {notification.isVisible && (
                <div className={`fixed top-4 right-4 ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default NewUserForm;