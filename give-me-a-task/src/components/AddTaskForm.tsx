import { useContext } from "react";
import { CreateTaskData } from "../types";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { createTask } from "../graphql/mutations.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserContext } from "../context/UserContext";
import { TaskContext } from "../context/TaskContext";
import { Button, Heading, Input, TextAreaField, View, useTheme } from "@aws-amplify/ui-react";

import { IoMdAdd as AddIcon } from "react-icons/io";

const client = generateClient();

type FormValues = {
    name: string
    description: string
}

const AddTaskForm = () => {
    const { userId } = useContext(UserContext);
    const { tasks, setTasks } = useContext(TaskContext);

    const { tokens } = useTheme();

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            description: ""
        }
    });

    const submitForm: SubmitHandler<FormValues> = async (formData: FormValues) => {
        try {
            const task = {
                ...formData,
                userId,
                index: tasks[tasks.length - 1].index + 1,
            };

            reset();

            console.log("Task to add:", task);

            // Create record in DynamoDB
            const result = await client.graphql({
                query: createTask,
                variables: {
                    input: task,
                },
            }) as GraphQLResult<CreateTaskData>;

            // Update local state
            const addedTask = result.data.createTask;
            setTasks([...tasks, addedTask]);

            console.log("Task added successfully:", addedTask);

        }
        catch (error) {
            console.log('Error creating task:', error);
        }
    }

    return (
        <View
            as="div"
            backgroundColor={tokens.colors.dark}
            className="rounded-lg p-3 space-y-3"
        >
            <Heading
                level={6}
                color={tokens.colors.light}
                className="text-center"
            >
                Add a task
            </Heading>

            <form
                onSubmit={handleSubmit(submitForm)}
                className="flex flex-col justify-center space-y-1"
            >
                <Input
                    {...register("name", { required: true })}
                    placeholder="Task"
                    required
                    backgroundColor={tokens.colors.dark}
                    color={tokens.colors.light}
                    className="rounded-lg"
                />

                <TextAreaField
                    {...register("description")}
                    rows={3}
                    placeholder="Description (optional)"
                    name="description"
                    label="description"
                    labelHidden={true}
                    backgroundColor={tokens.colors.dark}
                    borderRadius="8px"
                    style={{ color: `${tokens.colors.light}` }}
                />

                <Button
                    type="submit"
                    backgroundColor={tokens.colors.dark}
                    color={tokens.colors.light}
                    size="small"
                    borderRadius="8px"
                >
                    <AddIcon size={18} className="mr-1" />
                    Add
                </Button>
            </form>
        </View>
    );
}

export default AddTaskForm;