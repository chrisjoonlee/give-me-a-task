export type Task = {
    id: string
    name: string
    description: string
}

export type CreateTaskInput = {
    name: string
    description: string
}

export const isTask = (task: Task | CreateTaskInput): task is Task => {
    return (task as Task).id !== undefined;
}

export type ListTasksData = {
    listTasks: {
        items: Task[]
    }
}