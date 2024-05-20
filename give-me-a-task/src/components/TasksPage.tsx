import { type AuthUser } from "aws-amplify/auth";
import '@aws-amplify/ui-react/styles.css';

import AddTaskForm from "./AddTaskForm.tsx";
import TaskList from "./TaskList.tsx";
import RandomTask from "./RandomTask.tsx";
import { View } from "@aws-amplify/ui-react";
import Undo from "./Undo.tsx";
import { useContext } from "react";
import { CompletedTasksContext } from "../context/CompletedTasksContext.tsx";

type TasksProps = {
    user?: AuthUser;
}

const TasksPage: React.FC<TasksProps> = () => {
    const { completedTasks } = useContext(CompletedTasksContext);

    return (
        <View
            as="div"
            className="flex flex-col space-y-3"
        >
            <TaskList />
            <RandomTask />
            <AddTaskForm />

            {completedTasks.length > 0 &&
                <Undo />
            }
        </View>
    );
}

export default TasksPage;