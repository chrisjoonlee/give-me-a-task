import { type AuthUser } from "aws-amplify/auth";
import '@aws-amplify/ui-react/styles.css';

import AddTaskForm from "./AddTaskForm.tsx";
import TaskList from "./TaskList.tsx";
import RandomTask from "./TaskPageComponents/RandomTask.tsx";
import Undo from "./Undo.tsx";
import { useContext } from "react";
import { CompletedTasksContext } from "../context/CompletedTasksContext.tsx";
import { TaskContext } from "../context/TaskContext.tsx";
import { PopupContext } from "../context/PopupContext.tsx";
import Timer from "./Timer.tsx";

type TasksProps = {
    user?: AuthUser;
}

const TasksPage: React.FC<TasksProps> = () => {
    const { completedTasks } = useContext(CompletedTasksContext);
    const { tasksByIndex, setTasksByIndex,
        tasksByDueDate, setTasksByDueDate,
        sortType } = useContext(TaskContext);
    const { showTaskList, setShowTaskList } = useContext(PopupContext);

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
                showTasks={showTaskList}
                setShowTasks={setShowTaskList}
            />

            <div className="space-y-3">
                <RandomTask />
                <AddTaskForm type="myTasks" />
                <Timer />
                {completedTasks.length > 0 &&
                    <Undo />
                }
            </div>
        </div>
    );
}

export default TasksPage;