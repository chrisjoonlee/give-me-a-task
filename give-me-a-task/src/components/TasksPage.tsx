import { type AuthUser } from "aws-amplify/auth";
import '@aws-amplify/ui-react/styles.css';

import AddTaskForm from "./AddTaskForm.tsx";
import TaskList from "./TaskList.tsx";
import RandomTask from "./TaskPageComponents/RandomTask.tsx";
import Undo from "./Undo.tsx";
import { useContext } from "react";
import { CompletedTasksContext } from "../context/CompletedTasksContext.tsx";
import { TaskContext } from "../context/TaskContext.tsx";

type TasksProps = {
    user?: AuthUser;
}

const TasksPage: React.FC<TasksProps> = () => {
    const { completedTasks } = useContext(CompletedTasksContext);
    const { tasksByIndex, setTasksByIndex,
        tasksByDueDate, setTasksByDueDate,
        sortType } = useContext(TaskContext);

    return (
        <div className="flex flex-col space-y-3 pb-8 pt-2 items-center
            sm:flex-row sm:w-screen sm:justify-center sm:space-x-4 sm:items-start sm:space-y-0">
            <TaskList
                type="myTasks"
                title="My Tasks"
                iconType="envelope"
                useFilters={true}
                tasks={sortType === "dueDate" ? tasksByDueDate : tasksByIndex}
                setTasks={sortType === "dueDate" ? setTasksByDueDate : setTasksByIndex}
            />

            <div className="space-y-3">
                <RandomTask />
                <AddTaskForm type="myTasks" />
                {completedTasks.length > 0 &&
                    <Undo />
                }
            </div>
        </div>
    );
}

export default TasksPage;