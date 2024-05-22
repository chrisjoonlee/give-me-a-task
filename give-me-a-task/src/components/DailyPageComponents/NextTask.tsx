import { useContext, useEffect } from "react";
import { TaskContext } from "../../context/TaskContext";
import { Button, Text, useTheme } from "@aws-amplify/ui-react";
import NextTaskCard from "./NextTaskCard";

const NextTask = () => {
    const {
        tasksByIndex, tasksByDueDate,
        currentTask, setCurrentTask,
        dailyTasks,
        currentDailyTaskIndex, setCurrentDailyTaskIndex
    } = useContext(TaskContext);

    const { tokens } = useTheme();

    const handleStartDay = () => {
        if (dailyTasks.length) setCurrentDailyTaskIndex(0);
        window.localStorage.setItem("currentDailyTaskIndex", "0");
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
                onClick={handleStartDay}
                backgroundColor={tokens.colors.dark}
                color={tokens.colors.light}
                borderRadius="8px"
            >
                {currentDailyTaskIndex >= 0 ? 'Restart' : 'Start my day'}
            </Button>

            {/* Show random task */}
            {currentDailyTaskIndex >= 0 &&
                <NextTaskCard task={dailyTasks[currentDailyTaskIndex]} />
            }

            {/* If there are no tasks */}
            {currentDailyTaskIndex < 0 &&
                <Text color={tokens.colors.light}>
                    You have no tasks!
                </Text>
            }
        </div>
    );
}

export default NextTask;