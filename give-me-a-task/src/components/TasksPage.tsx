import { type AuthUser } from "aws-amplify/auth";
import '@aws-amplify/ui-react/styles.css';

import AddTaskForm from "./AddTaskForm.tsx";
import TaskList from "./TaskList.tsx";
import RandomTask from "./RandomTask.tsx";
import { View } from "@aws-amplify/ui-react";

type TasksProps = {
    user?: AuthUser;
}

const TasksPage: React.FC<TasksProps> = () => {
    return (
        <View
            as="div"
            className="flex flex-col space-y-3"
        >
            <TaskList />
            <RandomTask />
            <AddTaskForm />
        </View>
    );
}

export default TasksPage;