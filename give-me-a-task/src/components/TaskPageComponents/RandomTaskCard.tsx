import { Button, Text, useTheme } from "@aws-amplify/ui-react";
import { Task } from "../../types.ts";
import { TaskContext } from "../../context/TaskContext.tsx";
import React, { useContext, useEffect } from "react";
import { CompletedTasksContext } from "../../context/CompletedTasksContext.tsx";
import '../animations.css';
import DueDateBadge from "./DueDateBadge.tsx";
import { deleteTask } from "../../functions.ts";

type RandomTaskCardProps = {
    task: Task
}

const RandomTaskCard = ({ task }: RandomTaskCardProps) => {
    const { tokens } = useTheme();
    const {
        tasksByIndex, setTasksByIndex,
        tasksByDueDate, setTasksByDueDate,
        taskCompleted, setTaskCompleted
    } = useContext(TaskContext);
    const { completedTasks, setCompletedTasks } = useContext(CompletedTasksContext);

    const handleComplete = async () => {
        deleteTask(task)
            .then(deletedTask => {
                if (deletedTask) {
                    // Update local state
                    setTasksByIndex(tasksByIndex.filter(task => task.id !== deletedTask.id));
                    setTasksByDueDate(tasksByDueDate.filter(task => task.id !== deletedTask.id));
                    setTaskCompleted(true);

                    // Add to completed tasks list
                    setCompletedTasks([...completedTasks, deletedTask]);
                }
            });
    }

    useEffect(() => {
        console.log("Completed tasks:", completedTasks);
    }, [completedTasks]);

    useEffect(() => {
        console.log("task completed:", taskCompleted);
    }, [taskCompleted]);

    return (
        <>
            {/* TASK COMPLETED */}
            {taskCompleted ? (
                <div className="w-full text-center py-4 bg-medium rounded-lg animate-glow">
                    <Text color={tokens.colors.light}>
                        Great job!
                    </Text>
                </div>

            ) : (

                // NORMAL TASK CARD
                <div
                    key={task.id}
                    className="group w-full text-center pt-3 bg-medium rounded-lg"
                >

                    <div className="px-3 pb-5">
                        {/* Heading */}
                        <div className="font-bold text-light break-words">
                            {task.name.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Description */}
                        {task.description &&
                            <div
                                className="text-light mt-3 break-words"
                            >
                                {task.description.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                        }

                        {/* Due date badge */}
                        {task.dueDate &&
                            <div className="flex justify-center mt-3">
                                <DueDateBadge date={task.dueDate} />
                            </div>
                        }
                    </div>

                    {/* Complete button */}
                    <Button
                        color={tokens.colors.light}
                        onClick={handleComplete}
                        className="w-full bg-gray-600 border-none rounded-t-none hover:bg-gray-700 font-normal"
                    >
                        Complete
                    </Button>
                </div>
            )}
        </>
    );
}

export default RandomTaskCard;