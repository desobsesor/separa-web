import { getCurrentDate } from '@/utils/dateUtils';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Ui {
    [key: string]: any;
}

interface UIContextType {
    ui: Ui;
    setUi: (ui: Ui) => void;
    date: string;
    setDate: (date: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ui, setUi] = useState<Ui>({});
    const [date, setDate] = useState<string>(() => {
        return getCurrentDate();
    });

    const value = React.useMemo(() => ({ ui, setUi, date, setDate }), [ui, setUi, date, setDate]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};

const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};

export default useUI;