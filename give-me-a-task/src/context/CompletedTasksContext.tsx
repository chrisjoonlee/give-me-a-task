import React, { createContext, useState } from 'react';
import { Task } from '../types';

type StateSetter<T> = (value: T | ((prevValue: T) => T)) => void;

export type CompletedTasksContextType = {
    completedTasks: Task[];
    setCompletedTasks: StateSetter<Task[]>;
}

const CompletedTasksContext = createContext<CompletedTasksContextType>({
    completedTasks: [],
    setCompletedTasks: () => { }
});

type CompletedTasksContextProviderProps = {
    children: React.ReactNode;
}

const CompletedTasksProvider = ({ children }: CompletedTasksContextProviderProps) => {
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

    return (
        <CompletedTasksContext.Provider value={{
            completedTasks, setCompletedTasks
        }}>
            {children}
        </CompletedTasksContext.Provider>
    );
}

export { CompletedTasksContext, CompletedTasksProvider };