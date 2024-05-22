import React, { createContext, useState } from 'react';
import { Task } from '../types';

type StateSetter<T> = (value: T | ((prevValue: T) => T)) => void;

export type TaskContextType = {
    tasksByIndex: Task[];
    setTasksByIndex: StateSetter<Task[]>;
    tasksByDueDate: Task[];
    setTasksByDueDate: StateSetter<Task[]>;
    currentTask: Task | boolean | null;
    setCurrentTask: StateSetter<Task | boolean | null>;
    taskCompleted: boolean;
    setTaskCompleted: StateSetter<boolean>;
    sortType: string;
    setSortType: StateSetter<string>;
    dailyTasks: Task[];
    setDailyTasks: StateSetter<Task[]>;
    currentDailyTask: Task | boolean | null;
    setCurrentDailyTask: StateSetter<Task | boolean | null>;
}

const TaskContext = createContext<TaskContextType>({
    tasksByIndex: [],
    setTasksByIndex: () => { },
    tasksByDueDate: [],
    setTasksByDueDate: () => { },
    currentTask: null,
    setCurrentTask: () => { },
    taskCompleted: false,
    setTaskCompleted: () => { },
    sortType: "",
    setSortType: () => { },
    dailyTasks: [],
    setDailyTasks: () => { },
    currentDailyTask: null,
    setCurrentDailyTask: () => { }
});

type TaskContextProviderProps = {
    children: React.ReactNode;
}

const TaskProvider = ({ children }: TaskContextProviderProps) => {
    const [tasksByIndex, setTasksByIndex] = useState<Task[]>([]);
    const [tasksByDueDate, setTasksByDueDate] = useState<Task[]>([]);
    const [currentTask, setCurrentTask] = useState<Task | boolean | null>(null);
    // null = task not yet requested
    // Task = there is a current task
    // false = task requested but there are no tasks

    const [taskCompleted, setTaskCompleted] = useState<boolean>(false);
    const [sortType, setSortType] = useState<string>("");
    const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
    const [currentDailyTask, setCurrentDailyTask] = useState<Task | boolean | null>(null);

    return (
        <TaskContext.Provider value={{
            tasksByIndex, setTasksByIndex,
            tasksByDueDate, setTasksByDueDate,
            currentTask, setCurrentTask,
            taskCompleted, setTaskCompleted,
            sortType, setSortType,
            dailyTasks, setDailyTasks,
            currentDailyTask, setCurrentDailyTask
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export { TaskContext, TaskProvider };