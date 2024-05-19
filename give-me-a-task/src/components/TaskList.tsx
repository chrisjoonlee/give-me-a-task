import { useContext, useEffect, useState } from "react";
import { ListTasksData, Task, isTask } from "../types";

import { listTasks } from '../graphql/queries.ts';
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { UserContext } from "../context/UserContext.tsx";

import * as subscriptions from '../graphql/subscriptions';
import { TaskContext } from "../context/TaskContext.tsx";

const client = generateClient();

// const createSub = client
//   .graphql({ query: subscriptions.onCreateTask })
//   .subscribe({
//     next: ({ data }) => console.log("createSub:", data),
//     error: (error) => console.warn"createSub error:", error)
//   });

const TaskList = () => {
    const { userId } = useContext(UserContext);
    const { tasks, setTasks } = useContext(TaskContext);

    const fetchTasks = async () => {
        try {
            // Send request to DynamoDB
            const taskData = await client.graphql({
                query: listTasks,
                variables: {
                    filter: {
                        userId: { eq: userId }
                    }
                }
            }) as GraphQLResult<ListTasksData>;

            const tasks = taskData.data.listTasks.items;

            console.log("Task list:", tasks);
            setTasks(tasks);
        } catch (error) {
            console.log('Error fetching tasks:', error);
        }
    }

    useEffect(() => {
        console.log("TaskList.tsx, userId:", userId);
        fetchTasks();
    }, [userId]);

    return (
        <>
            <h2>Task list</h2>
            {
                tasks.map((task) => (
                    <div key={task.id}>
                        <p>{task.name}</p>
                        <p>{task.description}</p>
                    </div>
                ))
            }
        </>
    );
}

// createSub.unsubscribe();

export default TaskList;