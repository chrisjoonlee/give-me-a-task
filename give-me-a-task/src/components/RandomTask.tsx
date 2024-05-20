import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import { Button, Text, View, useTheme } from "@aws-amplify/ui-react";
import RandomTaskCard from "./RandomTaskCard";

const RandomTask = () => {
    const {
        tasks,
        currentTask, setCurrentTask,
        setTaskCompleted
    } = useContext(TaskContext);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    // const [randomTask, setRandomTask] = useState<Task | boolean | null>(null);

    const { tokens } = useTheme();

    const generateRandomTask = () => {
        setTaskCompleted(false);

        // Generate a task
        if (tasks.length > 0) {
            console.log("Number of tasks:", tasks.length);

            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * tasks.length);
            }
            while (randomIndex === currentIndex);
            setCurrentIndex(randomIndex);

            console.log("Random index:", randomIndex);
            setCurrentTask(tasks[randomIndex]);
        }
        // There are no tasks to generate
        else setCurrentTask(false);
    }

    useEffect(() => {
        // Reset current task if task list changes
        if (currentTask === false) setCurrentTask(null);
    }, [tasks]);

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

            {/* Show random task */}
            {currentTask && currentTask !== true &&
                <RandomTaskCard task={currentTask} />
            }

            {/* If there are no tasks */}
            {currentTask === false &&
                <Text color={tokens.colors.light}>You have no tasks!</Text>
            }
        </View>
    );
}

export default RandomTask;