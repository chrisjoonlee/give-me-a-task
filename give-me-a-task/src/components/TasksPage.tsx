import { type AuthUser } from "aws-amplify/auth";
import '@aws-amplify/ui-react/styles.css';

import AddTaskForm from "./AddTaskForm.tsx";
import TaskList from "./TaskList.tsx";
import RandomTask from "./RandomTask.tsx";
import Undo from "./Undo.tsx";
import { useContext } from "react";
import { CompletedTasksContext } from "../context/CompletedTasksContext.tsx";

type TasksProps = {
    user?: AuthUser;
}

const TasksPage: React.FC<TasksProps> = () => {
    const { completedTasks } = useContext(CompletedTasksContext);

    return (
        <div className="flex flex-col space-y-3 pb-8 items-center
            sm:flex-row sm:w-screen sm:justify-center sm:space-x-4 sm:items-start sm:space-y-0">
            <TaskList />

            <div className="space-y-3">
                <RandomTask />
                <AddTaskForm />
                {completedTasks.length > 0 &&
                    <Undo />
                }
            </div>
        </div>
    );
}

export default TasksPage;