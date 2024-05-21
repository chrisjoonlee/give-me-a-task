import { useContext, useState } from "react";
import { BsFilterRight as FilterIcon } from "react-icons/bs";
import { FaClock as ClockIcon } from "react-icons/fa";
import { TaskContext } from "../context/TaskContext";
import { BiSolidSortAlt as SortIcon } from "react-icons/bi";

const TaskFilter = () => {
    const { setSortType } = useContext(TaskContext);

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="w-full px-3 flex flex-col items-end">
            {/* Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="absolute text-light top-14 right-3 cursor-pointer hover:bg-medium p-1 rounded-full transition-colors">
                <FilterIcon size={24} />
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="flex flex-col space-y-2">
                    {/* Normal order */}
                    <div
                        onClick={() => setSortType("index")}
                        className="bg-light rounded-lg text-dark px-3 py-2 text-sm flex items-center space-x-2 cursor-pointer font-semibold hover:bg-gray-300 transition-colors"
                    >
                        <SortIcon />
                        <div>Sort normally</div>
                    </div>

                    {/* Sort by due date */}
                    <div
                        onClick={() => setSortType("dueDate")}
                        className="bg-light rounded-lg text-dark px-3 py-2 text-sm flex items-center space-x-2 cursor-pointer font-semibold hover:bg-gray-300 transition-colors">
                        <ClockIcon />
                        <div>Sort by due date</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskFilter;