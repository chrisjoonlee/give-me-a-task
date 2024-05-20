import { Button, Text, View, useTheme } from "@aws-amplify/ui-react";
import { DeleteTaskData, Task } from "../types.ts";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { deleteTask } from "../graphql/mutations.ts";
import { TaskContext } from "../context/TaskContext";
import { useContext, useEffect } from "react";
import { CompletedTasksContext } from "../context/CompletedTasksContext.tsx";

const client = generateClient();

type RandomTaskCardProps = {
    task: Task
}

const RandomTaskCard = ({ task }: RandomTaskCardProps) => {
    const { tokens } = useTheme();
    const {
        tasks, setTasks,
        taskCompleted, setTaskCompleted
    } = useContext(TaskContext);
    // const [completed, setCompleted] = useState(false);
    const { completedTasks, setCompletedTasks } = useContext(CompletedTasksContext);

    const handleComplete = async () => {
        try {
            // Delete record in DynamoDB
            const result = await client.graphql({
                query: deleteTask,
                variables: {
                    input: {
                        id: task.id
                    }
                }
            }) as GraphQLResult<DeleteTaskData>;

            const deletedTask = result.data.deleteTask;
            console.log("Successfully deleted task:", deletedTask);

            setTasks(tasks.filter(task => task.id !== deletedTask.id));
            setTaskCompleted(true);

            // Add to completed tasks list
            setCompletedTasks([...completedTasks, deletedTask]);
        }
        catch (error) {
            console.log("Error deleting task:", error);
        }
    }

    useEffect(() => {
        console.log("Completed tasks:", completedTasks);
    }, [completedTasks]);

    useEffect(() => {
        console.log("task completed:", taskCompleted);
    }, [taskCompleted]);

    return (
        <>
            {taskCompleted ? (
                <View
                    as="div"
                    backgroundColor={tokens.colors.medium}
                    borderRadius="8px"
                    className="w-full text-center py-4"
                >
                    <Text color={tokens.colors.light}>Congratulations!</Text>
                </View>
            ) : (
                <View
                    key={task.id}
                    as="div"
                    backgroundColor={tokens.colors.medium}
                    borderRadius="8px"
                    className="relative group w-full text-center pt-3"
                >

                    <View className="px-2 pb-5">
                        {/* Heading */}
                        <Text
                            color={tokens.colors.light}
                            className="font-bold"
                        >
                            {task.name}
                        </Text>

                        {/* Description */}
                        {task.description &&
                            <Text
                                color={tokens.colors.light}
                                marginTop="0.8rem"
                            >
                                {task.description}
                            </Text>
                        }
                    </View>

                    {/* Complete button */}
                    <Button
                        color={tokens.colors.light}
                        onClick={handleComplete}
                        className="w-full bg-gray-600 border-none rounded-t-none hover:bg-gray-700 font-normal"
                    >
                        Complete
                    </Button>
                </View>
            )}
        </>
    );
}

export default RandomTaskCard;