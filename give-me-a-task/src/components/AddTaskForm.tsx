import { useContext } from "react";
import { CreateTaskData } from "../types";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { createTask } from "../graphql/mutations";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserContext } from "../context/UserContext";
import { TaskContext } from "../context/TaskContext";

const client = generateClient();

type FormValues = {
    name: string
    description: string
}

const AddTaskForm = () => {
    const { userId } = useContext(UserContext);
    const { tasks, setTasks } = useContext(TaskContext);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            description: ""
        }
    });

    const submitForm: SubmitHandler<FormValues> = async (formData: FormValues) => {
        try {
            const task = { ...formData, userId };
            reset();

            // Update DynamoDB
            const result = await client.graphql({
                query: createTask,
                variables: {
                    input: task,
                },
            }) as GraphQLResult<CreateTaskData>;

            const addedTask = result.data.createTask;

            console.log("Task added successfully:", addedTask)
            setTasks([...tasks, addedTask]);

        } catch (err) {
            console.log('Error creating task:', err);
        }
    }

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <input
                {...register("name", { required: true })}
                placeholder="Task"
                required
            />
            <input
                {...register("description")}
                placeholder="Description"
            />
            <button type="submit">
                Create Task
            </button>
        </form>
    );
}

export default AddTaskForm;