import { useContext, useState } from "react";
import { CreateDailyTaskData, CreateTaskData } from "../types.ts";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { createDailyTask, createTask } from "../graphql/mutations.ts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserContext } from "../context/UserContext.tsx";
import { TaskContext } from "../context/TaskContext.tsx";
import { Heading, useTheme } from "@aws-amplify/ui-react";
import TextareaAutosize from 'react-textarea-autosize';

import { IoMdAdd as AddIcon } from "react-icons/io";
import './animations.css';
import RichTextEditor from "./RichTextEditor.tsx";

const client = generateClient();

type FormValues = {
    name: string;
    description: string;
    dueDate?: string;
}

type AddTaskFormProps = {
    type: string;
}

const AddTaskForm = ({ type }: AddTaskFormProps) => {
    const { userId } = useContext(UserContext);
    const {
        tasksByIndex, setTasksByIndex,
        tasksByDueDate, setTasksByDueDate,
        dailyTasks, setDailyTasks
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

    const [description, setDescription] = useState<string>("");

    const submitForm: SubmitHandler<FormValues> = async (formData: FormValues) => {
        // Explode animation
        setAnimate(true);
        setTimeout(() => {
            setAnimate(false);
        }, 1000);

        // Create record in DynamoDB
        if (type === "myTasks") createTaskRecord(formData);
        if (type === "daily") createDailyTaskRecord(formData);
    }

    const createTaskRecord = async (formData: FormValues) => {
        if (tasksByIndex && tasksByDueDate) {
            try {
                const task = {
                    name: formData.name,
                    dueDate: formData.dueDate,
                    description,
                    userId,
                    index: tasksByIndex.length > 0 ? tasksByIndex[tasksByIndex.length - 1].index + 1 : 0
                };

                // Remove due date if no value present
                if (!task.dueDate) delete task.dueDate;

                reset();
                setDescription("");

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
    }

    const createDailyTaskRecord = async (formData: FormValues) => {
        if (dailyTasks) {
            try {
                const task = {
                    name: formData.name,
                    description,
                    userId,
                    index: dailyTasks.length > 0 ? dailyTasks[dailyTasks.length - 1].index + 1 : 0
                }

                reset();
                setDescription("");

                console.log("Daily task to add:", task);

                // Create record in DynamoDB
                const result = await client.graphql({
                    query: createDailyTask,
                    variables: {
                        input: task,
                    },
                }) as GraphQLResult<CreateDailyTaskData>;

                // Update local state
                const addedTask = result.data.createDailyTask;
                setDailyTasks([...dailyTasks, addedTask]);

                console.log("Daily task added successfully:", addedTask);
            }
            catch (error) {
                console.log('Error creating daily task:', error);
            }
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
                            className="border border-light rounded-lg px-4 py-3 mb-2 bg-dark"
                        />
                    )}
                />

                {/* Description input */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            field={field}
                            state={description}
                            setState={setDescription}
                            minRows={3}
                            maxRows={15}
                            placeholder="Description (optional)"
                            textAreaClassNames="rounded-lg px-4 py-3 bg-dark resize-none"
                            containerClassNames="mb-3 border border-light rounded-lg"
                            styleMenuClassNames="bg-medium py-1 text-light"
                        />
                    )}
                />

                {/* Due date input */}
                {type === "myTasks" &&
                    <div className="text-light mb-3">
                        <label htmlFor="due-date-input" className="flex flex-col text-sm">
                            Due date (optional)
                        </label>
                        <input
                            {...register("dueDate")}
                            type="date"
                            id="due-date-input"
                            min={today}
                            className="px-3 py-1 border border-light rounded-lg w-full cursor-pointer bg-dark"
                        />
                    </div>
                }

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