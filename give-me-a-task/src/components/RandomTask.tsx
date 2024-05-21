import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import { Button, Text, useTheme } from "@aws-amplify/ui-react";
import RandomTaskCard from "./RandomTaskCard";

const RandomTask = () => {
    const {
        tasksByIndex, tasksByDueDate,
        currentTask, setCurrentTask,
        setTaskCompleted
    } = useContext(TaskContext);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    // const [randomTask, setRandomTask] = useState<Task | boolean | null>(null);

    const { tokens } = useTheme();

    const generateRandomTask = () => {
        setTaskCompleted(false);

        // Generate a task
        if (tasksByIndex.length > 0) {
            console.log("Number of tasks:", tasksByIndex.length);

            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * tasksByIndex.length);
            }
            while (randomIndex === currentIndex);
            setCurrentIndex(randomIndex);

            console.log("Random index:", randomIndex);
            setCurrentTask(tasksByIndex[randomIndex]);
        }
        // There are no tasks to generate
        else setCurrentTask(false);
    }

    const getHighPriorityTask = () => {
        setCurrentTask(tasksByDueDate[0]);
    }

    useEffect(() => {
        // Reset current task if task list changes
        if (currentTask === false) setCurrentTask(null);
    }, [tasksByIndex, tasksByDueDate]);

    return (
        <div
            className="flex flex-col items-center space-y-3 w-[300px] rounded-lg bg-dark p-4"
        >
            {/* Heading */}
            <h1 className="text-base text-light font-bold">Give me a task</h1>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={generateRandomTask}
                    backgroundColor={tokens.colors.dark}
                    color={tokens.colors.light}
                    borderRadius="8px"
                >
                    Random
                </Button>

                <Button
                    onClick={getHighPriorityTask}
                    backgroundColor={tokens.colors.dark}
                    color={tokens.colors.light}
                    borderRadius="8px"
                    className="text-center"
                >
                    High Priority
                </Button>
            </div>

            {/* Show random task */}
            {currentTask && currentTask !== true &&
                <RandomTaskCard task={currentTask} />
            }

            {/* If there are no tasks */}
            {currentTask === false &&
                <Text color={tokens.colors.light}>You have no tasks!</Text>
            }
        </div>
    );
}

export default RandomTask;