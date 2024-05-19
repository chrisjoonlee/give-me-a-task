import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import { Task } from "../types";
import { Button, View, useTheme } from "@aws-amplify/ui-react";
import TaskCard from "./TaskCard";

const RandomTask = () => {
    const { tasks } = useContext(TaskContext);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [randomTask, setRandomTask] = useState<Task | null>(null);

    const { tokens } = useTheme();

    const generateRandomTask = () => {
        if (tasks.length > 0) {
            console.log("Number of tasks:", tasks.length);

            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * tasks.length);
            }
            while (randomIndex === currentIndex);
            setCurrentIndex(randomIndex);

            console.log("Random index:", randomIndex);
            setRandomTask(tasks[randomIndex]);
        }
        else setRandomTask(null);
    }

    return (
        <View
            as="div"
            borderRadius="8px"
            backgroundColor={tokens.colors.dark}
            padding="1rem"
            className="flex flex-col items-center space-y-3"
        >
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
                    full={true}
                />
            )}
        </View>
    );
}

export default RandomTask;