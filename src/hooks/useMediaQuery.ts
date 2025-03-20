import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Evitar errores durante SSR
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia(query);

        // Actualizar el estado inicialmente
        setMatches(media.matches);

        // Definir el callback para actualizar el estado cuando cambie la media query
        const listener = () => setMatches(media.matches);

        // Agregar el listener
        // Usar addEventListener con fallback para navegadores antiguos
        if (media.addEventListener) {
            media.addEventListener('change', listener);
        } else {
            // @ts-ignore - Para compatibilidad con navegadores antiguos
            media.addListener(listener);
        }

        // Limpiar
        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', listener);
            } else {
                // @ts-ignore - Para compatibilidad con navegadores antiguos
                media.removeListener(listener);
            }
        };
    }, [query]);

    return matches;
}