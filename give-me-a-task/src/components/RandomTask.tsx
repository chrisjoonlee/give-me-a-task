import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import { Task } from "../types";
import { Button, useTheme } from "@aws-amplify/ui-react";
import TaskCard from "./TaskCard";

const RandomTask = () => {
    const { tasks } = useContext(TaskContext);
    const [randomTask, setRandomTask] = useState<Task | null>(null);

    const { tokens } = useTheme();

    const generateRandomTask = () => {
        if (tasks.length > 0) {
            console.log("Number of tasks:", tasks.length);

            const randomIndex = Math.floor(Math.random() * tasks.length);
            console.log("Random index:", randomIndex);
            setRandomTask(tasks[randomIndex]);
        }
        else setRandomTask(null);
    }

    return (
        <>
            <Button
                onClick={generateRandomTask}
                backgroundColor={tokens.colors.dark}
                color={tokens.colors.light}
                borderRadius="8px"
            >
                Give me a task
            </Button>
            {randomTask && (
                <TaskCard
                    task={randomTask}
                />
            )}
        </>
    );
}

export default RandomTask;