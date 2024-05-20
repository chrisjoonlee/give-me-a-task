export type Task = {
    id: string;
    createdAt: string;
    description?: string;
    index: number;
    name: string;
    updatedAt?: string;
    userId: string;
}

export type CreateTaskInput = {
    id?: string;
    createdAt?: string;
    name: string;
    description?: string;
    index: number;
    userId: string;
}

export type ListTasksData = {
    listTasks: {
        items: Task[]
    }
}

export type SearchTasksData = {
    searchTasks: {
        items: Task[]
    }
}

export type CreateTaskData = {
    createTask: Task;
}

export type UpdateTaskData = {
    updateTask: Task;
}

export type DeleteTaskData = {
    deleteTask: Task;
}