import { GraphQLResult, generateClient } from "aws-amplify/api";
import { DeleteTaskData, SearchTasksData, Task } from "./types";
import { searchTasks } from './graphql/queries.ts';
import { deleteTask as deleteTaskQuery } from "./graphql/mutations.ts";

const client = generateClient();

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
        console.log("Task list:", tasks);
        return tasks;
    } catch (error) {
        console.log('Error fetching tasks:', error);
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