export type Task = {
    id: string
    createdAt: string
    description?: string
    index: number
    name: string
    userId: string
}

export type CreateTaskInput = {
    name: string
    description?: string
    index: number
    userId: string
}

export type ListTasksData = {
    listTasks: {
        items: Task[]
    }
}

export type CreateTaskData = {
    createTask: Task
}

export type UpdateTaskData = {
    updateTask: Task
}