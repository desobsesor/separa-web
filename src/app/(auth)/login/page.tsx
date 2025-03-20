"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Aquí iría la lógica de autenticación
            // Por ahora, simplemente redirigimos al dashboard
            router.push('/dashboard');
        } catch (err) {
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Inicia sesión en tu cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/register" className="font-medium text-primary hover:text-primary/90">
                            Regístrate
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Correo electrónico
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                Recordarme
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/90">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="text-danger text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}