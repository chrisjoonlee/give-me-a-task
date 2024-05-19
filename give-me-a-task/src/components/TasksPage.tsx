import { type AuthUser } from "aws-amplify/auth";
import '@aws-amplify/ui-react/styles.css';

import AddTaskForm from "./AddTaskForm.tsx";
import TaskList from "./TaskList.tsx";

type TasksProps = {
    user?: AuthUser;
}

const TasksPage: React.FC<TasksProps> = ({ user }) => {
    return (
        <>
            {user && <h1>Hello, {user.username}</h1>}
            <h2>My Tasks</h2>

            <AddTaskForm />

            <TaskList />
        </>
    );
}

export default TasksPage;