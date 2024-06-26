import React, { createContext, useState } from 'react';
import { Task } from '../types';

type StateSetter<T> = (value: T | ((prevValue: T) => T)) => void;

export type PopupContextType = {
    taskToEdit: Task | null;
    setTaskToEdit: StateSetter<Task | null>;
    showTaskList: boolean;
    setShowTaskList: StateSetter<boolean>;
    showDailyTaskList: boolean;
    setShowDailyTaskList: StateSetter<boolean>;
    showTimerEditForm: boolean;
    setShowTimerEditForm: StateSetter<boolean>;
}

const PopupContext = createContext<PopupContextType>({
    taskToEdit: null,
    setTaskToEdit: () => { },
    showTaskList: false,
    setShowTaskList: () => { },
    showDailyTaskList: false,
    setShowDailyTaskList: () => { },
    showTimerEditForm: false,
    setShowTimerEditForm: () => { }
});

type PopupContextProviderProps = {
    children: React.ReactNode;
}

const PopupProvider = ({ children }: PopupContextProviderProps) => {
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [showTaskList, setShowTaskList] = useState<boolean>(false);
    const [showDailyTaskList, setShowDailyTaskList] = useState<boolean>(false);
    const [showTimerEditForm, setShowTimerEditForm] = useState<boolean>(false);

    return (
        <PopupContext.Provider value={{
            taskToEdit, setTaskToEdit,
            showTaskList, setShowTaskList,
            showDailyTaskList, setShowDailyTaskList,
            showTimerEditForm, setShowTimerEditForm
        }}>
            {children}
        </PopupContext.Provider>
    );
}

export { PopupContext, PopupProvider };