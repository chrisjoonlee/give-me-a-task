import { useContext, useEffect } from "react";
import { ListTasksData } from "../types";

import { listTasks } from '../graphql/queries.ts';
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { UserContext } from "../context/UserContext.tsx";

import { TaskContext } from "../context/TaskContext.tsx";

import { Heading, ScrollView, View, useTheme } from '@aws-amplify/ui-react';
import TaskCard from "./TaskCard.tsx";

const client = generateClient();

const TaskList = () => {
    const { userId } = useContext(UserContext);
    const { tasks, setTasks } = useContext(TaskContext);

    const { tokens } = useTheme();

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
        if (userId) {
            console.log("TaskList.tsx, user ID:", userId);
            fetchTasks();
        }
        else console.log("TaskList.tsx: No user ID");
    }, [userId]);

    return (
        <View
            as="div"
            backgroundColor={tokens.colors.dark}
            className="flex flex-col items-center w-80 space-y-3 py-3 rounded-t-lg"
        >
            {/* Heading */}
            <Heading level={5} color={tokens.colors.light}>
                My Tasks
            </Heading>

            {/* Tasks */}
            <ScrollView
                width="100%"
                height="90%"
                className="flex flex-col space-y-2 px-3"
            >
                {
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))
                }
            </ScrollView>
        </View>
    );
}

// createSub.unsubscribe();

export default TaskList;