import { useContext, useEffect } from "react";
import { CompletedTasksContext } from "../context/CompletedTasksContext";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { Text, View, useTheme } from "@aws-amplify/ui-react";
import { TaskContext } from "../context/TaskContext";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { createTask } from "../graphql/mutations.ts";
import { CreateTaskData } from "../types.ts";

const client = generateClient();

const Undo = () => {
    const { tasks, setTasks, setCurrentTask, setTaskCompleted } = useContext(TaskContext);
    const { completedTasks, setCompletedTasks } = useContext(CompletedTasksContext);
    const { tokens } = useTheme();

    const handleClick = async () => {
        if (completedTasks.length) {
            try {
                // Update completed tasks list
                const lastTask = completedTasks[completedTasks.length - 1];
                setCompletedTasks(completedTasks.slice(0, completedTasks.length - 1));

                // Update local state
                setTasks([...tasks, lastTask]);
                setCurrentTask(lastTask);
                setTaskCompleted(false);

                const inputData = {
                    id: lastTask.id,
                    createdAt: lastTask.createdAt,
                    name: lastTask.name,
                    description: lastTask.description,
                    index: lastTask.index,
                    userId: lastTask.userId
                }

                // Update DynamoDB
                const result = await client.graphql({
                    query: createTask,
                    variables: {
                        input: inputData,
                    },
                }) as GraphQLResult<CreateTaskData>;

                const restoredTask = result.data.createTask;
                console.log("Task restored successfully:", restoredTask);
            }
            catch (error) {
                console.log('Error restoring task:', error);
            }
        }
    }

    useEffect(() => {
        console.log("Completed tasks:", completedTasks);
    }, [completedTasks]);

    return (
        <View
            as="div"
            onClick={handleClick}
            backgroundColor={tokens.colors.dark}
            color={tokens.colors.light}
            className="flex py-3 px-4 rounded-lg items-center justify-center cursor-pointer"
        >
            <UndoIcon size={18} className="mr-2" />
            <Text
                color={tokens.colors.light}
                className="font-semibold"
            >
                Undo
            </Text>
        </View>
    );
}

export default Undo;