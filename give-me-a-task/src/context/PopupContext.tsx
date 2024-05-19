import React, { createContext, useState } from 'react';
import { Task } from '../types';

type StateSetter<T> = (value: T | ((prevValue: T) => T)) => void;

export type PopupContextType = {
    taskToEdit: Task | null;
    setTaskToEdit: StateSetter<Task | null>;
}

const PopupContext = createContext<PopupContextType>({
    taskToEdit: null,
    setTaskToEdit: () => { }
});

type PopupContextProviderProps = {
    children: React.ReactNode;
}

const PopupProvider = ({ children }: PopupContextProviderProps) => {
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    return (
        <PopupContext.Provider value={{
            taskToEdit, setTaskToEdit
        }}>
            {children}
        </PopupContext.Provider>
    );
}

export { PopupContext, PopupProvider };