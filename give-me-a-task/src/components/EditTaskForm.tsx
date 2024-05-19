import { Button, View, useTheme } from "@aws-amplify/ui-react";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { PopupContext } from "../context/PopupContext";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { updateTask } from "../graphql/mutations.ts";
import { UpdateTaskData } from "../types";
import { TaskContext } from "../context/TaskContext";

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

    const { register, handleSubmit, reset } = useForm<FormValues>({
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
                console.log('Error creating task:', error);
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
                className="flex flex-col justify-center space-y-1 rounded-lg"
            >
                <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Task"
                    className={`text-light bg-medium`}
                    required
                />

                <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Description (optional)"
                    name="description"
                    style={{ resize: "none" }}
                    className={`text-light bg-medium`}
                />

                <Button
                    type="submit"
                    backgroundColor={tokens.colors.medium}
                    color={tokens.colors.light}
                    size="small"
                    borderRadius="8px"
                >
                    Save
                </Button>
            </form>
        </View >
    );
}

export default EditTaskForm;