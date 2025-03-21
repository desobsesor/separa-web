"use client"

import useUI from '@/context/UIContext';
import { getUsers, getUsersWithReservations } from '@/services/api';
import { getBlockColor } from '@/utils/helpers';
import { CheckIcon, UserIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface User {
    _id: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    style?: string;
}

interface UserTableProps {
    initialUsers?: User[];
}

const UserTable: React.FC<UserTableProps> = ({ initialUsers = [] }) => {
    const { ui, date, setDate } = useUI();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const availableFields = ['name', 'phoneNumber', 'email', 'address'];
    const filteredSuggestions = tagInput
        ? availableFields.filter(field =>
            field.toLowerCase().includes(tagInput.toLowerCase()) &&
            !selectedFields.includes(field))
        : [];

    const suggestionsRef = useRef<HTMLDivElement>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastUserElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreUsers();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const loadMoreUsers = async () => {
        setLoading(true);
        try {
            const newUsers = await getUsersWithReservations(filter, selectedFields, page, 10, date);
            if (newUsers.length === 0) {
                setHasMore(false);
            } else {
                setUsers(prevUsers => [...prevUsers, ...newUsers]);
                setPage(prevPage => prevPage + 1);
            }
        } catch (error) {
            console.error('Error al cargar más usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchInitialUsers = async () => {
            setLoading(true);
            try {
                const initialData = await getUsersWithReservations('', [], 1, 10, date);
                if (initialData.length > 0) {
                    setUsers(initialData);
                    setPage(2);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error al cargar usuarios iniciales:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialUsers();

    }, [ui]);

    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        if (!filter) return true;

        const filterLowerCase = filter.toLowerCase();

        if (selectedFields.length === 0) {
            return availableFields.some(field => {
                const fieldValue = user[field as keyof User]?.toString().toLowerCase() ?? '';
                return fieldValue.includes(filterLowerCase);
            });
        }

        return selectedFields.some(field => {
            const fieldValue = user[field as keyof User]?.toString().toLowerCase() ?? '';
            return fieldValue.includes(filterLowerCase);
        });
    }) : [];

    const handleDoubleClick = (user: User) => {
        const isSelected = selectedUsers.some(selectedUser => selectedUser._id === user._id);

        if (isSelected) {
            setSelectedUsers(selectedUsers?.filter(selectedUser => selectedUser._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const isUserSelected = (userId: string) => {
        return selectedUsers.some(user => user._id === userId);
    };

    const handleSelectField = (field: string) => {
        if (!selectedFields.includes(field)) {
            setSelectedFields([...selectedFields, field]);
        }
        setTagInput('');
        setShowSuggestions(false);
    };

    const handleRemoveField = (field: string) => {
        setSelectedFields(selectedFields.filter(f => f !== field));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="min-w-full bg-white rounded-lg shadow-sm overflow-hidden mt-5">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Usuarios con reservas</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <div className="flex flex-wrap items-center p-2.5 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-pink-100">
                            {selectedFields.map(field => (
                                <div key={field} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-1 px-2 py-1 rounded">
                                    {field}
                                    <button
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                        onClick={() => handleRemoveField(field)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                placeholder={selectedFields.length > 0 ? "Agregar más campos..." : "Seleccionar campos de búsqueda..."}
                                className="flex-grow outline-none text-sm min-w-[120px]"
                                value={tagInput}
                                onChange={(e) => {
                                    setTagInput(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                        </div>
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <div
                                ref={suggestionsRef}
                                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                            >
                                {filteredSuggestions.map(field => (
                                    <div
                                        key={field}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        onClick={() => handleSelectField(field)}
                                    >
                                        {field}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Input Filtro"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    setLoading(true);
                                    try {
                                        const filteredUsers = await getUsersWithReservations(filter, selectedFields, 1, 10, date);
                                        setUsers(filteredUsers);
                                        setHasMore(false);
                                    } catch (error) {
                                        console.error('Error al aplicar filtro:', error);
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {selectedUsers.length > 0 && (
                <div className="p-3 bg-blue-50 border-b border-blue-100">
                    <p className="text-sm text-blue-700">
                        <span className="font-semibold">{selectedUsers.length}</span> usuarios seleccionados
                    </p>
                </div>
            )}

            <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                {filteredUsers.map((user: any, index: any) => {
                    const isLastElement = index === filteredUsers.length - 1;
                    const isSelected = isUserSelected(user._id);
                    return (
                        <div
                            key={index + 1}
                            ref={isLastElement ? lastUserElementRef : null}
                            className={`flex items-center p-4 border-b hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                            style={{ backgroundColor: isSelected ? 'rgba(219, 234, 254, 0.8)' : (user.style ?? 'transparent') }}
                            onDoubleClick={() => handleDoubleClick(user)}
                        >
                            <div className="flex-shrink-0 mr-2">
                                <div className={`h-6 w-6 rounded border ${isSelected ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'} flex items-center justify-center`}>
                                    {isSelected && <CheckIcon className="h-4 w-4 text-white" />}
                                </div>
                            </div>
                            <div className="flex-shrink-0 mr-4">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon className="h-6 w-6 text-gray-500" />
                                </div>
                            </div>
                            <div className="flex-grow grid grid-cols-4 gap-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-sm text-gray-500">{user.address}</div>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                                <div className={`h-6 w-6 rounded  ${getBlockColor(user.style).bg} ${getBlockColor(user.style).border} border-1  ${user.style}`}></div>
                            </div>
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {!hasMore && filteredUsers.length > 0 && (
                    <div className="text-center p-4 text-sm text-gray-500">
                        No hay más usuarios para mostrar
                    </div>
                )}

                {filteredUsers.length === 0 && !loading && (
                    <div className="text-center p-8 text-gray-500">
                        No se encontraron usuarios con ese filtro
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTable;