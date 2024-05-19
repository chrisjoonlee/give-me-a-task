export type Task = {
    id: string
    createdAt: string
    description?: string
    name: string
    userId: string
}

export type CreateTaskInput = {
    name: string
    description?: string
    userId: string
}

export const isTask = (task: Task | CreateTaskInput): task is Task => {
    return (task as Task).id !== undefined;
}

export type ListTasksData = {
    listTasks: {
        items: Task[]
    }
}

export type CreateTaskData = {
    createTask: Task
}