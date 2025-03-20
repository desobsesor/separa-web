import { useState, ChangeEvent, FormEvent } from 'react';

type FormErrors<T> = Partial<Record<keyof T, string>>;

interface UseFormProps<T> {
    initialValues: T;
    validate?: (values: T) => FormErrors<T>;
    onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit
}: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<FormErrors<T>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                return;
            }
        }

        setIsSubmitting(true);

        try {
            await onSubmit(values);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
    };

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        reset,
        setValues
    };
}