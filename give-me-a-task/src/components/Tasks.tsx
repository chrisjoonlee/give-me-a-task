import { useEffect, useState } from "react";

import { type AuthUser } from "aws-amplify/auth";
import '@aws-amplify/ui-react/styles.css';

import { createTask } from '../graphql/mutations.ts';
import { listTasks } from '../graphql/queries.ts';
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { CreateTaskInput, ListTasksData, Task, isTask } from "../types";

const initialState: CreateTaskInput = { name: '', description: '' };
const client = generateClient();

type TasksProps = {
    user?: AuthUser;
}

const Tasks: React.FC<TasksProps> = ({ user }) => {
    const [formState, setFormState] = useState<CreateTaskInput>(initialState);
    const [tasks, setTasks] = useState<(Task | CreateTaskInput)[]>([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const taskData = await client.graphql({
                query: listTasks,
            }) as GraphQLResult<ListTasksData>;

            console.log("Task data:", taskData);

            const tasks = taskData.data.listTasks.items;
            setTasks(tasks);
        } catch (err) {
            console.log('error fetching tasks');
        }
    }

    async function addTask() {
        try {
            if (!formState.name || !formState.description) return;
            const task = { ...formState };
            setTasks([...tasks, task]);
            setFormState(initialState);
            await client.graphql({
                query: createTask,
                variables: {
                    input: task,
                },
            });
        } catch (err) {
            console.log('error creating task:', err);
        }
    }

    return (
        <>
            {user && <h1>Hello, {user.username}</h1>}
            <h2>My Tasks</h2>
            <input
                onChange={(event) =>
                    setFormState({ ...formState, name: event.target.value })
                }
                value={formState.name}
                placeholder="Name"
            />
            <input
                onChange={(event) =>
                    setFormState({ ...formState, description: event.target.value })
                }
                value={formState.description as string}
                placeholder="Description"
            />
            <button onClick={addTask}>
                Create Task
            </button>
            {tasks.map((task, index) => (
                <div key={isTask(task) ? task.id : index}>
                    <p>{task.name}</p>
                    <p>{task.description}</p>
                </div>
            ))}
        </>
    );
}

export default Tasks;