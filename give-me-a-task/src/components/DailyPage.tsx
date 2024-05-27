import { useContext } from "react";
import AddTaskForm from "./AddTaskForm";
import NextTask from "./DailyPageComponents/NextTask";
import TaskList from "./TaskList";
import { TaskContext } from "../context/TaskContext";

const DailyPage = () => {
    const { dailyTasks, setDailyTasks } = useContext(TaskContext);

    return (
        <div className="flex flex-col space-y-3 pb-8 pt-2 items-center
                sm:flex-row sm:w-screen sm:justify-center sm:space-x-4 sm:items-start sm:space-y-0">
            <TaskList
                type="daily"
                title="Daily"
                iconType="sun"
                useFilters={false}
                tasks={dailyTasks}
                setTasks={setDailyTasks}
            />

            <div className="space-y-3">
                <NextTask />
                <AddTaskForm type="daily" />
                {/* {completedTasks.length > 0 &&
                        <Undo />
                    } */}
            </div>
        </div>
    );
}

export default DailyPage;