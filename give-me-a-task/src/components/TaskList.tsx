import { useContext, useEffect, useState } from "react";
import { Task, UpdateDailyTaskData, UpdateTaskData } from "../types.ts";

import { updateDailyTask, updateTask } from '../graphql/mutations.ts';
import { GraphQLResult, generateClient } from "aws-amplify/api";

import { TaskContext } from "../context/TaskContext.tsx";

import { Heading, Text, useTheme } from '@aws-amplify/ui-react';
import TaskCard from "./TaskPageComponents/TaskCard.tsx";
import { FaEnvelope as ClosedEnvelopeIcon } from "react-icons/fa";
import { FaEnvelopeOpen as OpenEnvelopeIcon } from "react-icons/fa";
import { PopupContext } from "../context/PopupContext.tsx";
import EditTaskForm from "./EditTaskForm.tsx";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import TaskFilter from "./TaskPageComponents/TaskFilter.tsx";
import { IoSunny as SunIcon } from "react-icons/io5";

const client = generateClient();

type TaskListProps = {
    type: string;
}

const TaskList = ({ type }: TaskListProps) => {
    const { tasksByIndex, tasksByDueDate, dailyTasks, sortType } = useContext(TaskContext);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showTasks, setShowTasks] = useState(false);
    const { taskToEdit } = useContext(PopupContext);

    const { tokens } = useTheme();

    const updateTaskIndex = async (task: Task, index: number) => {
        try {
            console.log("Task to update:", task);
            console.log("New index:", index);

            // Update record in DynamoDB
            if (type === "myTasks") {
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

            if (type === "daily") {
                const result = await client.graphql({
                    query: updateDailyTask,
                    variables: {
                        input: {
                            id: task.id,
                            index
                        }
                    }
                }) as GraphQLResult<UpdateDailyTaskData>;

                const updatedTask = result.data.updateDailyTask;
                console.log("Daily task updated successfully:", updatedTask);
            }
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

    // Populate tasks (local state)
    useEffect(() => {
        if (type === "myTasks") {
            console.log("Sort type:", sortType);

            if (tasksByIndex && tasksByDueDate) {
                console.log("Goal");

                if (sortType === "dueDate") {
                    setTasks(tasksByDueDate);
                }
                else {
                    setTasks(tasksByIndex);
                }
            }
        }
    }, [tasksByIndex, tasksByDueDate, sortType]);

    // Populate daily tasks (local state)
    useEffect(() => {
        if (type === "daily" && dailyTasks) {
            setTasks(dailyTasks);
        }
    }, [dailyTasks]);

    useEffect(() => {
        console.log("Task to edit:", taskToEdit);
    }, [taskToEdit]);

    return (
        <div className="flex flex-col w-[300px] items-center space-y-4 pt-3 pb-5 rounded-lg bg-dark max-h-[calc(100vh-140px)] relative">

            {/* Heading */}
            <Heading level={5} color={tokens.colors.light}>
                {type === "myTasks" && "My Tasks"}
                {type === "daily" && "Daily"}
            </Heading>

            {/* Icon */}
            <div
                onClick={() => setShowTasks(!showTasks)}
                className="cursor-pointer text-light
                    hover:-rotate-6 hover:text-white"
            >
                {/* Envelope icon */}
                {type === "myTasks" && (showTasks ?
                    <OpenEnvelopeIcon size={30} />
                    :
                    <ClosedEnvelopeIcon size={30} />
                )}

                {/* Sun icon */}
                {type === "daily" && <SunIcon size={30} />}
            </div>

            {/* Task filter */}
            {type === "myTasks" && showTasks && <TaskFilter />}

            {/* If there are no tasks: Message */}
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
                                                type={type}
                                            />
                                        )
                                        // Norml task card
                                        else return (
                                            <TaskCard
                                                key={task.id}
                                                index={index}
                                                task={task}
                                                type={type}
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

export default TaskList;