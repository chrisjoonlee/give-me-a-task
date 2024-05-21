import { useContext, useState } from "react";
import { CreateTaskData } from "../types";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { createTask } from "../graphql/mutations.ts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserContext } from "../context/UserContext";
import { TaskContext } from "../context/TaskContext";
import { Heading, useTheme } from "@aws-amplify/ui-react";
import TextareaAutosize from 'react-textarea-autosize';

import { IoMdAdd as AddIcon } from "react-icons/io";
import './animations.css';

const client = generateClient();

type FormValues = {
    name: string
    description: string
    dueDate?: string
}

const AddTaskForm = () => {
    const { userId } = useContext(UserContext);
    const {
        tasksByIndex, setTasksByIndex,
        tasksByDueDate, setTasksByDueDate
    } = useContext(TaskContext);

    const { tokens } = useTheme();
    const [animate, setAnimate] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const { register, handleSubmit, reset, control } = useForm<FormValues>({
        defaultValues: {
            name: "",
            description: ""
        }
    });

    const submitForm: SubmitHandler<FormValues> = async (formData: FormValues) => {
        // Explode animation
        setAnimate(true);
        setTimeout(() => {
            setAnimate(false);
        }, 1000);

        try {
            const task = {
                ...formData,
                userId,
                index: tasksByIndex.length > 0 ? tasksByIndex[tasksByIndex.length - 1].index + 1 : 0
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
            setTasksByIndex([...tasksByIndex, addedTask]);
            setTasksByDueDate([...tasksByDueDate, addedTask]);

            console.log("Task added successfully:", addedTask);
        }
        catch (error) {
            console.log('Error creating task:', error);
        }
    }

    const contents =
        <>
            <Heading
                level={6}
                color={tokens.colors.light}
                className="text-center"
            >
                Add a task
            </Heading>

            <form
                onSubmit={handleSubmit(submitForm)}
                className="flex flex-col justify-center"
            >
                {/* Name input */}
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
                            className="border border-light rounded-lg px-4 py-3 mb-1"
                        />
                    )}
                />

                {/* Description input */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextareaAutosize
                            {...field}
                            minRows={3}
                            maxRows={15}
                            placeholder="Description (optional)"
                            className="border border-light rounded-lg px-4 py-3 mb-3"
                        />
                    )}
                />

                {/* Due date input */}
                <div className="text-light mb-3">
                    <label htmlFor="due-date-input" className="flex flex-col text-sm">
                        Due date (optional)
                    </label>
                    <input
                        {...register("dueDate")}
                        type="date"
                        id="due-date-input"
                        min={today}
                        className="px-3 py-1 border border-light rounded-lg w-full cursor-pointer"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="border border-light bg-dark rounded-lg px-4 py-3 flex items-center justify-center"
                >
                    <AddIcon size={18} className="mr-1" />
                    <div>Add</div>
                </button>
            </form>
        </>

    return (
        <>
            {/* Small screen animation */}
            <div className={`rounded-lg p-3 space-y-3 max-w-[400px] bg-dark
            sm:hidden
            ${animate && 'animate-slide-task-up'}`}>
                {contents}
            </div>

            {/* Large screen animation */}
            <div className={`hidden rounded-lg p-3 space-y-3 max-w-[400px] bg-dark
            sm:block
            ${animate && 'animate-slide-task-left'}`}>
                {contents}
            </div>
        </>
    );
}

export default AddTaskForm;