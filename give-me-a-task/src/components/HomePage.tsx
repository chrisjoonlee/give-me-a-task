import { Tabs } from "@aws-amplify/ui-react";
import TasksPage from "./TasksPage";
import DailyPage from "./DailyPage";

const HomePage = () => {
    return (
        <div className="-mt-4">
            <Tabs
                spacing="relative"
                items={[
                    { label: "Daily", value: "daily", content: <DailyPage /> },
                    { label: "My Tasks", value: "myTasks", content: <TasksPage /> }
                ]}
            />
        </div>
    );
}

export default HomePage;