"use client"

import React, { useState, useEffect, useRef } from 'react';
import { createBlock, getUsers, User, CreateBlockData } from '@/services/api';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { getCurrentDate, combineDateAndTime, dateToLocalISOString, getNextDayDate } from '@/utils/dateUtils';
import useUI from '@/context/UIContext';
import Card from '../ui/Card';
import { CheckIcon, PlusIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/16/solid';
import { DocumentPlusIcon } from '@heroicons/react/16/solid';

interface FormData {
    startTime: string;
    endTime: string;
    attachedUser: string;
    style: string;
    date: string;
}

interface ValidationErrors {
    startTime?: string;
    endTime?: string;
    attachedUser?: string;
    date?: string;
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
        <div className={`absolute transform ${bgColor} text-white px-3 py-1 rounded-md shadow-lg text-sm animate-fade-in`}>
            {message}
        </div>
    );
};

const blockStyles = [
    { id: 'trabajo', name: 'Trabajo', color: 'bg-blue-100' },
    { id: 'descanso', name: 'Descanso', color: 'bg-green-100' },
    { id: 'comida', name: 'Comida', color: 'bg-orange-100' },
    { id: 'reunión', name: 'Reunión', color: 'bg-purple-100' },
    { id: 'otro', name: 'Otro', color: 'bg-gray-100' }
];

const NewBlockForm: React.FC = () => {
    const { ui, setUi, setDate } = useUI();
    const [formData, setFormData] = useState<FormData>({
        startTime: '',
        endTime: '',
        attachedUser: '',
        style: 'trabajo',
        date: getNextDayDate()
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCurrentDate, setIsCurrentDate] = useState<boolean>(true);

    const endTimePickerRef = useRef<any>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await getUsers(1, 100);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
                showNotification('Error al cargar la lista de usuarios', 'error');
            }
        };

        loadUsers();
    }, [ui]);

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type, isVisible: true });

        setTimeout(() => {
            setNotification(prev => ({ ...prev, isVisible: false }));
        }, 3000);
    };

    useEffect(() => {
        const today = getCurrentDate();
        setIsCurrentDate(formData.date === today || formData.date < today);
    }, [formData.date]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'date') {
            setDate(value);
        }
        validateField(name, value);
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setFormData(prev => ({
            ...prev,
            attachedUser: user._id
        }));

        if (errors.attachedUser) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.attachedUser;
                return newErrors;
            });
        }
    };

    const validateField = (name: string, value: string) => {
        let fieldErrors: ValidationErrors = { ...errors };

        switch (name) {
            case 'date':
                if (!value) {
                    fieldErrors.date = 'La fecha es requerida';
                } else {
                    delete fieldErrors.date;
                }
                break;
            case 'startTime':
                if (!value) {
                    fieldErrors.startTime = 'La hora de inicio es requerida';
                } else {
                    delete fieldErrors.startTime;
                }
                break;
            case 'endTime':
                if (!value) {
                    fieldErrors.endTime = 'La hora de fin es requerida';
                } else if (formData.startTime && value <= formData.startTime) {
                    fieldErrors.endTime = 'La hora de fin debe ser posterior a la hora de inicio';
                } else {
                    delete fieldErrors.endTime;
                }
                break;
            case 'attachedUser':
                if (!value) {
                    fieldErrors.attachedUser = 'Debe seleccionar un usuario';
                } else {
                    delete fieldErrors.attachedUser;
                }
                break;
            default:
                break;
        }

        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    const validateForm = (): boolean => {
        const { date, startTime, endTime, attachedUser } = formData;
        let isValid = true;
        let newErrors: ValidationErrors = {};

        if (!date) {
            newErrors.date = 'La fecha es requerida';
            isValid = false;
        }

        if (!startTime) {
            newErrors.startTime = 'La hora de inicio es requerida';
            isValid = false;
        }

        if (!endTime) {
            newErrors.endTime = 'La hora de fin es requerida';
            isValid = false;
        } else if (startTime && endTime <= startTime) {
            newErrors.endTime = 'La hora de fin debe ser posterior a la hora de inicio';
            isValid = false;
        }

        if (!attachedUser) {
            newErrors.attachedUser = 'Debe seleccionar un usuario';
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
            const startDateTime = combineDateAndTime(formData.date, formData.startTime);
            const endDateTime = combineDateAndTime(formData.date, formData.endTime);

            const blockData: CreateBlockData = {
                startTime: dateToLocalISOString(startDateTime),
                endTime: dateToLocalISOString(endDateTime),
                attachedUser: formData.attachedUser,
                style: formData.style
            };

            await createBlock(blockData);

            showNotification('Bloque de tiempo creado exitosamente', 'success');
            setUi(blockData);

            setFormData({
                startTime: '',
                endTime: '',
                attachedUser: '',
                style: 'trabajo',
                date: formData.date
            });
            setSelectedUser(null);
        } catch (error) {
            console.error('Error al crear bloque de tiempo:', error);
            showNotification('Error al crear el bloque de tiempo', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-w-full flex flex-col pt-3">
            <Card title="Nuevo bloque de tiempo" className="relative mt-1 mx-2">
                <Tooltip
                    message={notification.message}
                    type={notification.type}
                    isVisible={notification.isVisible}
                />

                <form onSubmit={handleSubmit} className="space-y-2 px-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center md:hidden lg:hidden">
                            <div className='w-full md:flex-1'>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`w-full md:w-32 pl-2 mr-0 py-1.5 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                            </div>
                        </div>

                        <div className="flex flex-row gap-2">
                            <div className='hidden md:block flex-1'>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={`w-32 pl-2 mr-0 py-1.5 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                            </div>

                            <div className="flex-1">
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hora inicio
                                </label>
                                <TimePicker
                                    onChange={(value) => {
                                        handleChange({
                                            target: { name: 'startTime', value: value ?? '' }
                                        } as React.ChangeEvent<HTMLInputElement>);

                                        if (value && value.length === 5 && !isCurrentDate) {
                                            setTimeout(() => {
                                                if (endTimePickerRef.current) {
                                                    const inputElement = endTimePickerRef.current.querySelector('input');
                                                    if (inputElement) {
                                                        inputElement.focus();
                                                    }
                                                }
                                            }, 10);
                                        }
                                    }}
                                    value={formData.startTime}
                                    format="HH:mm"
                                    disableClock={true}
                                    clearIcon={null}
                                    disabled={isCurrentDate}
                                    className={`${errors.startTime ? 'border-red-500' : 'border-gray-300'} ${isCurrentDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
                            </div>

                            <div className="flex-1">
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hora fin
                                </label>
                                <div ref={endTimePickerRef}>
                                    <TimePicker
                                        onChange={(value) => {
                                            handleChange({
                                                target: { name: 'endTime', value: value ?? '' }
                                            } as React.ChangeEvent<HTMLInputElement>);
                                        }}
                                        value={formData.endTime}
                                        format="HH:mm"
                                        disableClock={true}
                                        clearIcon={null}
                                        disabled={isCurrentDate}
                                        className={`min-w-full ${errors.endTime ? 'border-red-500' : 'border-gray-300'} ${isCurrentDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de bloque
                        </label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {blockStyles.map(style => (
                                <div
                                    key={style.id}
                                    onClick={() => !isCurrentDate && setFormData(prev => ({ ...prev, style: style.id }))}
                                    className={`${style.color} p-2 rounded-md ${!isCurrentDate ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} border-2 ${formData.style === style.id ? 'border-blue-500' : 'border-transparent'} transition-all`}
                                >
                                    <div className="text-sm font-medium">{style.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario asignado
                        </label>
                        {errors.attachedUser && <p className="mt-1 text-xs text-red-500">{errors.attachedUser}</p>}

                        <div className={`max-h-40 overflow-y-auto border border-gray-300 rounded-md ${isCurrentDate ? 'opacity-50' : ''}`}>
                            {users.length === 0 ? (
                                <div className="p-3 text-sm text-gray-500">No hay usuarios disponibles</div>
                            ) : (
                                users.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => !isCurrentDate && handleUserSelect(user)}
                                        className={`p-2 border-b border-gray-200 ${!isCurrentDate ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'} ${selectedUser?._id === user._id ? 'bg-blue-100' : ''} flex justify-between items-center`}
                                    >
                                        <div className="font-medium">{user.name}</div>
                                        {selectedUser?._id === user._id && (
                                            <CheckIcon className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-2">
                        <button
                            type="button"
                            className='relative flex p-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-500 hover:bg-gray-600 text-white bg-secondary hover:bg-secondary/90 focus:ring-secondary/50'
                            onClick={() => {
                                setFormData({
                                    startTime: '',
                                    endTime: '',
                                    attachedUser: '',
                                    style: 'trabajo',
                                    date: getCurrentDate()
                                });
                                setSelectedUser(null);
                                setErrors({});
                            }}
                        >
                            <TrashIcon className="h-5 w-5 mr-2 text-blue-50" />
                            Limpiar
                        </button>
                        <button
                            type="submit"
                            className={`relative flex w-full p-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 cursor-pointer button-separa ${!isCurrentDate ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`}
                            disabled={isSubmitting || isCurrentDate}
                        >
                            {!isCurrentDate && <PlusIcon className="h-6 w-6 mr-2 text-white" />}
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : isCurrentDate ? 'No disponible' : 'Guardar bloque'}

                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default NewBlockForm;