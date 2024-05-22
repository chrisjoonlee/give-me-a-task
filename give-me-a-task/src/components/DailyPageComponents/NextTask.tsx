import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../context/TaskContext";
import { Button, Text, useTheme } from "@aws-amplify/ui-react";
import RandomTaskCard from "../TaskPageComponents/RandomTaskCard";

const NextTask = () => {
    const {
        tasksByIndex, tasksByDueDate,
        currentTask, setCurrentTask,
        setTaskCompleted,
        dailyTasks,
        currentDailyTask, setCurrentDailyTask
    } = useContext(TaskContext);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    // const [randomTask, setRandomTask] = useState<Task | boolean | null>(null);

    const { tokens } = useTheme();

    const getNextTask = () => {
        let index = 0;
        if (currentDailyTask && currentDailyTask !== true) {
            index = currentDailyTask.index + 1;
        }
        if (index > dailyTasks.length - 1) index = -1;

        if (index >= 0) {
            setCurrentDailyTask(dailyTasks[index]);
        }
        else setCurrentDailyTask(false);
    }

    useEffect(() => {
        // Reset current task if task list changes
        if (currentTask === false) setCurrentTask(null);
    }, [tasksByIndex, tasksByDueDate]);

    return (
        <div
            className="flex flex-col items-center space-y-3 w-[300px] rounded-lg bg-dark p-4"
        >
            {/* Button */}
            <Button
                onClick={getNextTask}
                backgroundColor={tokens.colors.dark}
                color={tokens.colors.light}
                borderRadius="8px"
            >
                {currentDailyTask ? 'Next' : 'Start my day'}
            </Button>

            {/* Show random task */}
            {currentDailyTask && currentDailyTask !== true &&
                <RandomTaskCard task={currentDailyTask} />
            }

            {/* If there are no tasks */}
            {currentDailyTask === false &&
                <Text color={tokens.colors.light}>
                    You have no tasks!
                </Text>
            }
        </div>
    );
}

export default NextTask;