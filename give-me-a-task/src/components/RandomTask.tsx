import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import { Task } from "../types";

const RandomTask = () => {
    const { tasks } = useContext(TaskContext);
    const [randomTask, setRandomTask] = useState<Task | null>(null);

    const generateRandomTask = () => {
        if (tasks.length > 0) {
            console.log("Number of tasks:", tasks.length);

            const randomIndex = Math.floor(Math.random() * tasks.length);
            console.log("Random index:", randomIndex);
            setRandomTask(tasks[randomIndex]);
        }
        else setRandomTask(null);
    }

    return (
        <>
            <button onClick={generateRandomTask}>Random task</button>
            {randomTask && <div>{randomTask.name}</div>}
        </>
    );
}

export default RandomTask;