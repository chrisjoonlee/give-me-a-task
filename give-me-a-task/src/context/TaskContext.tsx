import React, { createContext, useState } from 'react';
import { Task } from '../types';

type StateSetter<T> = (value: T | ((prevValue: T) => T)) => void;

export type TaskContextType = {
    tasks: Task[];
    setTasks: StateSetter<Task[]>;
    currentTask: Task | boolean | null;
    setCurrentTask: StateSetter<Task | boolean | null>;
    taskCompleted: boolean;
    setTaskCompleted: StateSetter<boolean>;
}

const TaskContext = createContext<TaskContextType>({
    tasks: [],
    setTasks: () => { },
    currentTask: null,
    setCurrentTask: () => { },
    taskCompleted: false,
    setTaskCompleted: () => { }
});

type TaskContextProviderProps = {
    children: React.ReactNode;
}

const TaskProvider = ({ children }: TaskContextProviderProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentTask, setCurrentTask] = useState<Task | boolean | null>(null);
    // null = task not yet requested
    // Task = there is a current task
    // false = task requested but there are no tasks

    const [taskCompleted, setTaskCompleted] = useState<boolean>(false);

    return (
        <TaskContext.Provider value={{
            tasks, setTasks,
            currentTask, setCurrentTask,
            taskCompleted, setTaskCompleted
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export { TaskContext, TaskProvider };