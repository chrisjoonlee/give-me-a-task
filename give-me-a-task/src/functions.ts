import { GraphQLResult, generateClient } from "aws-amplify/api";
import { DeleteDailyTaskData, DeleteTaskData, SearchDailyTasksData, SearchTasksData, Task } from "./types";
import { searchDailyTasks, searchTasks } from './graphql/queries.ts';
import { deleteTask as deleteTaskQuery, deleteDailyTask as deleteDailyTaskQuery } from "./graphql/mutations.ts";

const client = generateClient();

const bullet = '• ';

export const fetchTasks = async (userId: string, sortType: string): Promise<Task[] | null> => {
    try {
        let sort;
        if (sortType === "index") {
            sort = {
                direction: "asc",
                field: "index"
            }
        }
        else if (sortType === "dueDate") {
            sort = {
                direction: "asc",
                field: "dueDate"
            }
        }
        else throw new Error("Invalid sort type");

        // Send request to DynamoDB
        const taskData = await client.graphql({
            query: searchTasks,
            variables: {
                filter: {
                    userId: { eq: userId }
                },
                sort
            }
        }) as GraphQLResult<SearchTasksData>;

        const tasks = taskData.data.searchTasks.items;
        console.log("searchTasks result:", tasks);
        return tasks;
    } catch (error) {
        console.log('Error fetching tasks:', error);
        return null;
    }
}

export const fetchDailyTasks = async (userId: string): Promise<Task[] | null> => {
    try {
        // Send request to DynamoDB
        const taskData = await client.graphql({
            query: searchDailyTasks,
            variables: {
                filter: {
                    userId: { eq: userId }
                },
                sort: {
                    direction: "asc",
                    field: "index"
                }
            }
        }) as GraphQLResult<SearchDailyTasksData>;

        const dailyTasks = taskData.data.searchDailyTasks.items;
        console.log("Daily task list:", dailyTasks);
        return dailyTasks;
    } catch (error) {
        console.log('Error fetching daily tasks:', error);
        return null;
    }
}

export const deleteTask = async (task: Task) => {
    try {
        // Delete record in DynamoDB
        const result = await client.graphql({
            query: deleteTaskQuery,
            variables: {
                input: {
                    id: task.id
                }
            }
        }) as GraphQLResult<DeleteTaskData>;

        const deletedTask = result.data.deleteTask;
        console.log("Successfully deleted task:", deletedTask);
        return deletedTask
    }
    catch (error) {
        console.log("Error deleting task:", error);
    }
}

export const deleteDailyTask = async (task: Task) => {
    try {
        // Delete record in DynamoDB
        const result = await client.graphql({
            query: deleteDailyTaskQuery,
            variables: {
                input: {
                    id: task.id
                }
            }
        }) as GraphQLResult<DeleteDailyTaskData>;

        const deletedTask = result.data.deleteDailyTask;
        console.log("Successfully deleted daily task:", deletedTask);
        return deletedTask
    }
    catch (error) {
        console.log("Error deleting daily task:", error);
    }
}

export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

export const distanceFromNow = (dateString: string): number => {
    const givenDate = new Date(dateString);
    const today = new Date();

    // Clear the time part of today's date for an accurate comparison
    today.setHours(0, 0, 0, 0);

    // Calculate the difference in time
    const differenceInTime = givenDate.getTime() - today.getTime();

    // Calculate the difference in days
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
};

export const isList = (text: string): boolean => {
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].slice(0, 2) === bullet) return true;
    }

    return false;
}