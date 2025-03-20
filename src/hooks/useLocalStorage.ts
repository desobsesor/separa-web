import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetValue<T>) => void] {
    // Estado para almacenar nuestro valor
    // Pasa la función de inicialización a useState para que la lógica
    // solo se ejecute una vez
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            // Obtener del almacenamiento local por clave
            const item = window.localStorage.getItem(key);
            // Analizar el JSON almacenado o si no existe devolver el valor inicial
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // Si hay un error, devolver el valor inicial
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Devolver una versión envuelta de la función setter de useState que
    // persiste el nuevo valor en localStorage.
    const setValue = (value: SetValue<T>) => {
        try {
            // Permitir que el valor sea una función para que tengamos la misma API que useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Guardar el estado
            setStoredValue(valueToStore);
            // Guardar en localStorage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // Una implementación más avanzada manejaría el caso de error
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Escuchar cambios en localStorage
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue) {
                setStoredValue(JSON.parse(event.newValue));
            }
        };

        // Agregar el event listener
        window.addEventListener('storage', handleStorageChange);

        // Eliminar el event listener al desmontar
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
}