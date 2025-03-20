import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    type = 'button',
    disabled = false,
}) => {
    const baseClasses = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
        secondary: 'bg-secondary text-gray-800 hover:bg-secondary/90 focus:ring-secondary/50',
        danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger/50',
    };

    const sizeClasses = {
        sm: 'py-1 px-3 text-sm',
        md: 'py-2 px-4 text-base',
        lg: 'py-3 px-6 text-lg',
    };

    return (
        <button
            className={`cursor-pointer ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            type={type}
            disabled
        >
            {children}
        </button>
    );
};

export default Button;