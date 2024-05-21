import { GraphQLResult, generateClient } from "aws-amplify/api";
import { useContext, useState } from "react";
import { BsFilterRight as FilterIcon } from "react-icons/bs";
import { FaClock as ClockIcon } from "react-icons/fa";
import { searchTasks } from "../graphql/queries.ts";
import { UserContext } from "../context/UserContext";
import { SearchTasksData } from "../types.ts";
import { TaskContext } from "../context/TaskContext";

const client = generateClient();

const TaskFilter = () => {
    const { userId } = useContext(UserContext);
    const { tasks, setTasks } = useContext(TaskContext);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const sortByDueDate = async () => {
        try {
            // Send request to DynamoDB
            const taskData = await client.graphql({
                query: searchTasks,
                variables: {
                    filter: {
                        userId: { eq: userId }
                    },
                    sort: {
                        direction: "asc",
                        field: "dueDate"
                    }
                }
            }) as GraphQLResult<SearchTasksData>;

            const tasks = taskData.data.searchTasks.items;

            console.log("Task list sorted by due date:", tasks);
            setTasks(tasks);
        } catch (error) {
            console.log('Error sorting tasks by due date:', error);
        }
    }

    return (
        <div className="w-full px-3 flex flex-col items-end">
            {/* Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="absolute text-light top-14 right-3 cursor-pointer">
                <FilterIcon size={24} />
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    onClick={sortByDueDate}
                    className="bg-light rounded-lg text-dark px-3 py-2 text-sm flex items-center space-x-2 cursor-pointer font-semibold">
                    <ClockIcon />
                    <div>Sort by due date</div>
                </div>
            )}
        </div>
    );
}

export default TaskFilter;