import { KeyboardEvent, useContext, useEffect, useRef, useState } from "react";
import { CreateDailyTaskData, CreateTaskData } from "../types.ts";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { createDailyTask, createTask } from "../graphql/mutations.ts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UserContext } from "../context/UserContext.tsx";
import { TaskContext } from "../context/TaskContext.tsx";
import { Heading, useTheme } from "@aws-amplify/ui-react";
import TextareaAutosize from 'react-textarea-autosize';
import { PiListBulletsBold as BulletListIcon } from "react-icons/pi";

import { IoMdAdd as AddIcon } from "react-icons/io";
import './animations.css';

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
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [listMode, setListMode] = useState<string>("");
    const bullet = '• ';

    const isBulleted = (string: string): boolean => {
        if (string.length < 2) return false;
        return string.slice(0, 2) === bullet;
    }

    const handleBulletList = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const { selectionStart, selectionEnd } = textarea;

            const valueBefore = description.slice(0, selectionStart);
            const linesBefore = valueBefore.split('\n');
            const previousLines = linesBefore.slice(0, -1).join('\n');
            const lastLine = linesBefore[linesBefore.length - 1];

            const valueAfter = description.slice(selectionEnd);
            const linesAfter = valueAfter.split('\n');
            const nextLines = linesAfter.slice(1).join('\n');
            const nextLine = linesAfter[0];

            if (selectionStart === selectionEnd) {
                const currentLine = lastLine + nextLine;

                if (isBulleted(currentLine)) removeBullet(textarea, previousLines, currentLine, nextLines, selectionStart);
                else addBullet(textarea, previousLines, currentLine, nextLines, selectionStart);
            }
            // Highlighted selection
            else {

                const selection = description.slice(selectionStart, selectionEnd);
                const selectedLines = selection.split('\n');

                let newValue = "";
                if (previousLines) newValue += previousLines + '\n';

                if (selectedLines.length === 1) {
                    const selectedLine = lastLine + selection + nextLine;
                    if (isBulleted(selectedLine)) {
                        newValue += selectedLine.slice(2);
                        setListMode("");
                    }
                    else {
                        newValue += bullet + selectedLine;
                        setListMode("bullet");
                    }
                }
                else {
                    let newMode = "";
                    const firstSelectedLine = lastLine + selectedLines[0];
                    if (!isBulleted(firstSelectedLine)) {
                        newMode = "bullet";
                        newValue += bullet;
                    }
                    newValue += firstSelectedLine;

                    if (selectedLines.length > 2) {
                        for (let i = 1; i < selectedLines.length - 1; i++) {
                            newValue += '\n';
                            if (!isBulleted(selectedLines[i])) {
                                newMode = "bullet";
                                newValue += bullet;
                            }
                            newValue += selectedLines[i];
                        }
                    }
                    const lastSelectedLine = selectedLines[selectedLines.length - 1] + nextLine;
                    newValue += '\n';
                    if (!isBulleted(lastSelectedLine)) {
                        newMode = "bullet";
                        newValue += bullet;
                    }
                    newValue += lastSelectedLine;

                    setListMode(newMode);
                }

                if (nextLines) newValue += '\n' + nextLines;

                setDescription(newValue);
            }
        }
    }

    const addBullet = (textarea: HTMLTextAreaElement, previousLines: string, currentLine: string, nextLines: string, selectionStart: number) => {
        setListMode("bullet");

        let newValue = "";
        if (previousLines) newValue += previousLines + '\n';
        newValue += bullet + currentLine;
        if (nextLines) newValue += '\n' + nextLines;
        setDescription(newValue);

        // Set cursor position
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + bullet.length + 1;
            textarea.focus();
        }, 0);
    }

    const removeBullet = (textarea: HTMLTextAreaElement, previousLines: string, currentLine: string, nextLines: string, selectionStart: number) => {
        setListMode("");

        console.log("HEY CUrrent line:", currentLine.slice(2));

        let newValue = "";
        if (previousLines) newValue += previousLines + '\n';
        newValue += currentLine.slice(2);
        if (nextLines) newValue += '\n' + nextLines;
        setDescription(newValue);

        // Set cursor position
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart - bullet.length;
            textarea.focus();
        }, 0);
    }

    const handleCursorChange = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const { selectionStart, selectionEnd } = textarea;
            const valueBefore: string = description.slice(0, selectionStart);
            const linesBefore = valueBefore.split('\n');
            const lastLine = linesBefore[linesBefore.length - 1];

            const valueAfter: string = description.slice(selectionEnd);
            const linesAfter = valueAfter.split('\n');
            const nextLine = linesAfter[0];

            const currentLine = lastLine + nextLine;

            if (isBulleted(currentLine)) setListMode("bullet");
            else setListMode("");
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (listMode === "bullet") {

            // Handle enter
            if (e.key === 'Enter') {
                e.preventDefault();

                const textarea = textareaRef.current;
                if (textarea) {
                    const { selectionStart, selectionEnd } = textarea;
                    const valueBefore: string = description.slice(0, selectionStart);
                    const linesBefore = valueBefore.split('\n');
                    const previousLines = linesBefore.slice(0, -1).join('\n');
                    const lastLine = linesBefore[linesBefore.length - 1];

                    const valueAfter: string = description.slice(selectionEnd);
                    const linesAfter = valueAfter.split('\n');
                    const nextLines = linesAfter.slice(1).join('\n');
                    const nextLine = linesAfter[0];

                    const currentLine = lastLine + nextLine;
                    const isEmptyBullet = currentLine === bullet;

                    if (isEmptyBullet) {
                        removeBullet(textarea, previousLines, currentLine, nextLines, selectionStart);
                        setListMode("");
                    }
                    else if (isBulleted(currentLine)) addBullet(textarea, valueBefore, nextLine, nextLines, selectionStart);
                }
            }
            // Handle delete
            else if (e.key === 'Delete' || e.key === 'Backspace') {

            }
        }
    };

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

    const createDailyTaskRecord = async (formData: FormValues) => {
        try {
            const task = {
                name: formData.name,
                description,
                userId,
                index: dailyTasks.length > 0 ? dailyTasks[dailyTasks.length - 1].index + 1 : 0
            }

            reset();

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
                        <div className="flex flex-col mb-3 border border-light rounded-lg">

                            {/* Style menu */}
                            <div className="bg-medium py-1 text-light flex items-center justify-center rounded-t-lg">
                                <div
                                    onClick={handleBulletList}
                                    className={`border-opacity-70 px-2 hover:bg-gray-600 cursor-pointer transition-colors
                                        ${listMode === "bullet" && "bg-gray-700"}`}
                                >

                                    <BulletListIcon size={18} />
                                </div>
                            </div>

                            {/* Input */}
                            <TextareaAutosize
                                {...field}
                                ref={textareaRef}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onSelect={handleCursorChange}
                                minRows={3}
                                maxRows={15}
                                placeholder="Description (optional)"
                                className="rounded-lg px-4 py-3 bg-dark"
                            />
                        </div>
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

    useEffect(() => {
        console.log("List mode:", listMode);
    }, [listMode]);

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