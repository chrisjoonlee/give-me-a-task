import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext.tsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PopupContext } from "../context/PopupContext.tsx";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { updateDailyTask, updateTask } from "../graphql/mutations.ts";
import { UpdateDailyTaskData, UpdateTaskData } from "../types.ts";
import { TaskContext } from "../context/TaskContext.tsx";
import TextareaAutosize from 'react-textarea-autosize';
import { deleteDailyTask, deleteTask } from "../functions.ts";
import { CompletedTasksContext } from "../context/CompletedTasksContext.tsx";
import RichTextEditor from "./RichTextEditor.tsx";

type FormValues = {
    name: string
    description: string
    dueDate?: string
}

const client = generateClient();

type EditTaskFormProps = {
    type: string;
}

const EditTaskForm = ({ type }: EditTaskFormProps) => {
    const { userId } = useContext(UserContext);
    const { taskToEdit, setTaskToEdit } = useContext(PopupContext);
    const {
        tasksByIndex, setTasksByIndex,
        tasksByDueDate, setTasksByDueDate,
        currentTask, setCurrentTask,
        dailyTasks, setDailyTasks
    } = useContext(TaskContext);
    const { completedTasks, setCompletedTasks } = useContext(CompletedTasksContext);
    const formRef = useRef<HTMLDivElement>(null);

    const today = new Date().toISOString().split('T')[0];

    const [description, setDescription] = useState<string>("");

    const { register, handleSubmit, reset, control } = useForm<FormValues>({
        defaultValues: {
            name: taskToEdit ? taskToEdit.name : "",
            description: taskToEdit ? taskToEdit.description : "",
        }
    });

    const submitForm: SubmitHandler<FormValues> = async (formData: FormValues) => {
        if (type === "myTasks") await editTask(formData);
        if (type === "daily") await editDailyTask(formData);
    }

    const editTask = async (formData: FormValues) => {
        if (taskToEdit && tasksByIndex && tasksByDueDate) {
            try {
                const task = {
                    name: formData.name,
                    dueDate: formData.dueDate,
                    description,
                    id: taskToEdit.id,
                    index: taskToEdit.index,
                    userId
                };

                // Remove due date if no value present
                if (!task.dueDate) delete task.dueDate;

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
                setTasksByIndex(tasksByIndex.map(task => task.id === updatedTask.id ? updatedTask : task));
                setTasksByDueDate(tasksByDueDate.map(task => task.id === updatedTask.id ? updatedTask : task));
                if (currentTask && currentTask !== true && currentTask.index === taskToEdit.index) {
                    setCurrentTask(updatedTask);
                }

                console.log("Task updated successfully:", updatedTask);
            }
            catch (error) {
                console.log('Error updating task:', error);
            }
        }
    };

    const editDailyTask = async (formData: FormValues) => {
        if (taskToEdit && dailyTasks) {
            try {
                const task = {
                    name: formData.name,
                    description,
                    id: taskToEdit.id,
                    index: taskToEdit.index,
                    userId
                };

                reset();
                setTaskToEdit(null);

                if (!task.dueDate) delete task.dueDate;

                console.log("TASK:", task);

                // Update record in DynamoDB
                const result = await client.graphql({
                    query: updateDailyTask,
                    variables: {
                        input: task
                    }
                }) as GraphQLResult<UpdateDailyTaskData>;

                // Update local state
                const updatedTask = result.data.updateDailyTask;
                setDailyTasks(dailyTasks.map(task => task.id === updatedTask.id ? updatedTask : task));

                console.log("Task updated successfully:", updatedTask);
            }
            catch (error) {
                console.log('Error updating task:', error);
            }
        }
    };

    const handleComplete = async () => {
        if (taskToEdit && dailyTasks && tasksByIndex && tasksByDueDate) {
            deleteTask(taskToEdit)
                .then(deletedTask => {
                    if (deletedTask) {
                        // Update local state
                        setTasksByIndex(tasksByIndex.filter(task => task.id !== deletedTask.id));
                        setTasksByDueDate(tasksByDueDate.filter(task => task.id !== deletedTask.id));

                        // Add to completed tasks list
                        setCompletedTasks([...completedTasks, deletedTask]);
                    }
                });
        }
    }

    const handleDeleteDailyTask = async () => {
        if (taskToEdit && dailyTasks) {
            console.log("Task to delete:", taskToEdit);
            deleteDailyTask(taskToEdit)
                .then(deletedTask => {
                    if (deletedTask) {
                        setDailyTasks(dailyTasks.filter(task => task.id !== deletedTask.id));

                        // Add to completed daily tasks
                    }
                })
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            setTaskToEdit(null);
        }
    };

    useEffect(() => {
        if (taskToEdit) {
            if (taskToEdit.description) setDescription(taskToEdit.description);

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
                return () => {
                    document.removeEventListener('click', handleClickOutside);
                };
            }, 100);
        }
    }, [taskToEdit]);

    return (
        <div
            ref={formRef}
            className="rounded-lg bg-medium px-3 py-3"
        >
            {/* EDIT TASK FORM */}
            <form
                onSubmit={handleSubmit(submitForm)}
                className="flex flex-col justify-center space-y-2 rounded-lg"
            >
                {/* Task input */}
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
                            className="text-light bg-medium resize-none px-4 py-2 border border-light rounded-lg"
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
                            textAreaClassNames="rounded-lg px-4 py-2 bg-medium resize-none"
                            containerClassNames="border border-light rounded-lg"
                            styleMenuClassNames="bg-gray-700 py-1 text-light"
                        />
                    )}
                />

                {/* Due date input */}
                {type === "myTasks" &&
                    <div className="text-light mb-3">
                        {/* <label htmlFor="due-date-input" className="flex flex-col text-sm">
                        Due date (optional)
                    </label> */}
                        <input
                            {...register("dueDate")}
                            type="date"
                            id="due-date-input"
                            min={today}
                            className="bg-medium border border-light px-2 rounded-lg w-full cursor-pointer"
                        />
                    </div>
                }

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        className="bg-red-800 hover:bg-red-900 rounded-lg flex items-center justify-center text-red-100 font-bold transition-colors"
                        onClick={type === "myTasks" ? handleComplete : handleDeleteDailyTask}
                    >
                        Delete
                    </button>

                    <button
                        type="submit"
                        className="border border-light bg-medium rounded-lg flex items-center justify-center"
                    >
                        Save
                    </button>
                </div>

            </form>
        </div >
    );
}

export default EditTaskForm;