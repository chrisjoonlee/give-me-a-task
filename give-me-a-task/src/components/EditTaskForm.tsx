import { Button, View, useTheme } from "@aws-amplify/ui-react";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PopupContext } from "../context/PopupContext";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { updateTask } from "../graphql/mutations.ts";
import { UpdateTaskData } from "../types";
import { TaskContext } from "../context/TaskContext";
import TextareaAutosize from 'react-textarea-autosize';

type FormValues = {
    name: string
    description: string
}

const client = generateClient();

const EditTaskForm = () => {
    const { userId } = useContext(UserContext);
    const { tokens } = useTheme();
    const { taskToEdit, setTaskToEdit } = useContext(PopupContext);
    const { tasks, setTasks } = useContext(TaskContext);
    const formRef = useRef<HTMLDivElement>(null);

    const { register, handleSubmit, reset, control } = useForm<FormValues>({
        defaultValues: {
            name: taskToEdit ? taskToEdit.name : "",
            description: taskToEdit ? taskToEdit.description : ""
        }
    });

    const submitForm: SubmitHandler<FormValues> = async (formData: FormValues) => {
        if (taskToEdit) {
            try {
                const task = {
                    ...formData,
                    id: taskToEdit.id,
                    index: taskToEdit.index,
                    userId
                };
                reset();
                setTaskToEdit(null);

                // Update record in DynamoDB
                const result = await client.graphql({
                    query: updateTask,
                    variables: {
                        input: task
                    }
                }) as GraphQLResult<UpdateTaskData>;

                // Update local state
                const updatedTask = result.data.updateTask;
                setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));

                console.log("Task updated successfully:", updatedTask);
            }
            catch (error) {
                console.log('Error updating task:', error);
            }
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            setTaskToEdit(null);
        }
    };

    useEffect(() => {
        if (taskToEdit) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
                return () => {
                    document.removeEventListener('click', handleClickOutside);
                };
            }, 100);
        }
    }, [taskToEdit]);

    return (
        <View
            as="div"
            ref={formRef}
            backgroundColor={tokens.colors.medium}
            padding="0.5rem 1rem"
            borderRadius="8px"
            className="rounded-lg"
        >
            <form
                onSubmit={handleSubmit(submitForm)}
                className="flex flex-col justify-center space-y-4 rounded-lg"
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
                            className="text-light bg-medium"
                        />
                    )}
                />

                {/* <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Task"
                    className={`text-light bg-medium`}
                    required
                /> */}

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            minRows={3}
                            maxRows={15}
                            placeholder="Description (optional)"
                            className="text-light bg-medium"
                        />
                    )}
                />

                {/* <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Description (optional)"
                    name="description"
                    style={{ resize: "none" }}
                    className={`text-light bg-medium`}
                /> */}

                {/* <Button
                    type="submit"
                    backgroundColor={tokens.colors.medium}
                    color={tokens.colors.light}
                    size="small"
                    borderRadius="8px"
                >
                    Save
                </Button> */}

                <button
                    type="submit"
                    className="border border-light bg-medium rounded-lg flex items-center justify-center"
                >
                    Save
                </button>
            </form>
        </View >
    );
}

export default EditTaskForm;