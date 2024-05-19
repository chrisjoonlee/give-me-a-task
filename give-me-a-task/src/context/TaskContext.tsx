import React, { createContext, useState } from 'react';
import { Task } from '../types';

type StateSetter<T> = (value: T | ((prevValue: T) => T)) => void;

export type TaskContextType = {
    tasks: Task[];
    setTasks: StateSetter<Task[]>;
}

const TaskContext = createContext<TaskContextType>({
    tasks: [],
    setTasks: () => { }
});

type TaskContextProviderProps = {
    children: React.ReactNode;
}

const TaskProvider = ({ children }: TaskContextProviderProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    return (
        <TaskContext.Provider value={{
            tasks, setTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export { TaskContext, TaskProvider };