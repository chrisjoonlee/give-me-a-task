import { useContext } from "react";
import { CreateTaskData } from "../types";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { createTask } from "../graphql/mutations.ts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserContext } from "../context/UserContext";
import { TaskContext } from "../context/TaskContext";
import { Heading, View, useTheme } from "@aws-amplify/ui-react";
import TextareaAutosize from 'react-textarea-autosize';

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

    const { handleSubmit, reset, control } = useForm({
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
                index: tasks.length > 0 ? tasks[tasks.length - 1].index + 1 : 0
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
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            required
                            minRows={1}
                            maxRows={15}
                            placeholder="Task"
                            className="border border-light rounded-lg px-4 py-3"
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            minRows={3}
                            maxRows={15}
                            placeholder="Description (optional)"
                            className="border border-light rounded-lg px-4 py-3"
                        />
                    )}
                />

                <button
                    type="submit"
                    className="border border-light bg-dark rounded-lg px-4 py-3 flex items-center justify-center"
                >
                    <AddIcon size={18} className="mr-1" />
                    <div>Add</div>
                </button>
            </form>
        </View>
    );
}

export default AddTaskForm;