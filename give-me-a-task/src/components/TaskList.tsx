import { useContext, useEffect, useState } from "react";
import { SearchTasksData, Task, UpdateTaskData } from "../types";

import { searchTasks } from '../graphql/queries.ts';
import { updateTask } from '../graphql/mutations.ts';
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { UserContext } from "../context/UserContext.tsx";

import { TaskContext } from "../context/TaskContext.tsx";

import { Heading, Text, useTheme } from '@aws-amplify/ui-react';
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
                query: searchTasks,
                variables: {
                    filter: {
                        userId: { eq: userId }
                    },
                    sort: {
                        direction: "asc",
                        field: "index"
                    }
                }
            }) as GraphQLResult<SearchTasksData>;

            const tasks = taskData.data.searchTasks.items;

            console.log("Task list:", tasks);
            setTasks(tasks);
        } catch (error) {
            console.log('Error fetching tasks:', error);
        }
    }

    const updateTaskIndex = async (task: Task, index: number) => {
        try {
            console.log("Task to update:", task);
            console.log("New index:", index);

            // Update record in DynamoDB
            const result = await client.graphql({
                query: updateTask,
                variables: {
                    input: {
                        id: task.id,
                        index
                    }
                }
            }) as GraphQLResult<UpdateTaskData>;

            const updatedTask = result.data.updateTask;
            console.log("Task updated successfully:", updatedTask);
        }
        catch (error) {
            console.log('Error updating task:', error);
        }
    }

    // Change task order after drag & drop
    const onDragEnd = (result: DropResult) => {
        console.log("ON DRAG END");

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
        newTasks.forEach((task, index) => {
            if (task.index !== index) updateTaskIndex(task, index);
        })
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
        <div className="flex flex-col w-[300px] items-center space-y-4 pt-3 pb-5 rounded-lg bg-dark max-h-[calc(100vh-140px)]">
            {/* Heading */}
            <Heading level={5} color={tokens.colors.light}>
                My Tasks
            </Heading>

            {/* Envelope icon */}
            <div
                onClick={() => setShowTasks(!showTasks)}
                className="cursor-pointer text-light"
            >
                {showTasks ? <OpenEnvelopeIcon size={30} /> : <ClosedEnvelopeIcon size={30} />}
            </div>

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
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex flex-col space-y-2 px-3 w-full overflow-y-scroll"
                            >
                                {
                                    tasks.map((task, index) => {
                                        // Edit task form
                                        if (taskToEdit && taskToEdit.id === task.id) return (
                                            <EditTaskForm
                                                key={task.id}
                                            />
                                        )
                                        // Norml task card
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
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            }
        </div>
    );
}

// createSub.unsubscribe();

export default TaskList;