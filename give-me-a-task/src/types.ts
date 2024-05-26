export type Task = {
    id: string;
    createdAt: string;
    description?: string;
    dueDate?: string;
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
    dueDate?: string;
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

export type SearchDailyTasksData = {
    searchDailyTasks: {
        items: Task[]
    }
}

export type CreateTaskData = {
    createTask: Task;
}

export type CreateDailyTaskData = {
    createDailyTask: Task;
}

export type UpdateTaskData = {
    updateTask: Task;
}

export type UpdateDailyTaskData = {
    updateDailyTask: Task;
}

export type DeleteTaskData = {
    deleteTask: Task;
}

export type DeleteDailyTaskData = {
    deleteDailyTask: Task;
}