import { useContext, useEffect, useState } from "react";
import { ListTasksData } from "../types";

import { listTasks } from '../graphql/queries.ts';
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { UserContext } from "../context/UserContext.tsx";

import { TaskContext } from "../context/TaskContext.tsx";

import { Heading, ScrollView, Text, View, useTheme } from '@aws-amplify/ui-react';
import TaskCard from "./TaskCard.tsx";
import { FaEnvelope as ClosedEnvelopeIcon } from "react-icons/fa";
import { FaEnvelopeOpen as OpenEnvelopeIcon } from "react-icons/fa";
import { PopupContext } from "../context/PopupContext.tsx";
import EditTaskForm from "./EditTaskForm.tsx";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";


const client = generateClient();

const TaskList = () => {
    const { userId } = useContext(UserContext);
    const { tasks, setTasks } = useContext(TaskContext);
    const [showTasks, setShowTasks] = useState(false);
    const { taskToEdit } = useContext(PopupContext);

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

    // Change task order after drag & drop
    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        // Update local state
        const newTasks = [...tasks];
        const movedTasks = newTasks.splice(source.index, 1);
        newTasks.splice(destination.index, 0, ...movedTasks);
        setTasks(newTasks);

        // Update records in DynamoDB

    }

    useEffect(() => {
        if (userId) {
            console.log("TaskList.tsx, user ID:", userId);
            fetchTasks();
        }
        else console.log("TaskList.tsx: No user ID");
    }, [userId]);

    useEffect(() => {
        console.log("Task to edit:", taskToEdit);
    }, [taskToEdit]);

    return (
        <View
            as="div"
            backgroundColor={tokens.colors.dark}
            className="flex flex-col items-center space-y-4 pt-3 pb-5 rounded-lg"
        >
            {/* Heading */}
            <Heading level={5} color={tokens.colors.light}>
                My Tasks
            </Heading>

            {/* Envelope icon */}
            <View
                as="div"
                onClick={() => setShowTasks(!showTasks)}
                color={tokens.colors.light}
                className="cursor-pointer"
            >
                {showTasks ? <OpenEnvelopeIcon size={30} /> : <ClosedEnvelopeIcon size={30} />}
            </View>

            {showTasks && tasks.length <= 0 &&
                <Text color={tokens.colors.light}>
                    You have no tasks!
                </Text>
            }

            {/* Tasks */}
            {showTasks && tasks.length > 0 &&
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="task-list">
                        {provided => (
                            <ScrollView
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                width="100%"
                                height="90%"
                                className="flex flex-col space-y-2 px-3"
                            >
                                {
                                    tasks.map((task, index) => {
                                        if (taskToEdit && taskToEdit.id === task.id) return (
                                            <EditTaskForm
                                                key={task.id}
                                            />
                                        )
                                        else return (
                                            <TaskCard
                                                key={task.id}
                                                index={index}
                                                task={task}
                                            />
                                        )
                                    })
                                }
                                {provided.placeholder}
                            </ScrollView>
                        )}
                    </Droppable>
                </DragDropContext>
            }
        </View>
    );
}

// createSub.unsubscribe();

export default TaskList;