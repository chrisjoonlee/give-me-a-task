import { Task } from "../types.ts";
import { HiOutlineMenuAlt2 as ExpandIcon } from "react-icons/hi";
import { useContext, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TaskContext } from "../context/TaskContext.tsx";
import DueDateBadge from "./TaskPageComponents/DueDateBadge.tsx";
import FormattedText from "./FormattedText.tsx";
import { MdEdit as EditIcon } from "react-icons/md";
import { PopupContext } from "../context/PopupContext.tsx";

type TaskCardProps = {
    index: number;
    task: Task;
    type: string;
}

const TaskCard = ({ index, task, type = "myTasks" }: TaskCardProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { sortType } = useContext(TaskContext);
    const { setTaskToEdit } = useContext(PopupContext);

    const handleClick = () => {
        if (task.description) {
            setOpen(!open);
        }
    }

    const content = <>
        {/* EDIT BUTTON */}
        <div>
            <div
                onClick={() => setTaskToEdit(task)}
                className="absolute right-2 hidden transition-colors p-1 rounded-full cursor-pointer text-light
                group-hover:block hover:bg-gray-700"
            >
                <EditIcon size={16} />
            </div>
        </div>

        {/* Heading */}
        <FormattedText
            text={task.name}
            classNames={`text-light ${open && 'font-bold'}`}
        />

        {/* Description */}
        {open && task.description &&
            <FormattedText
                text={task.description}
                classNames="text-light mt-3"
            />
        }

        {/* ICONS */}
        {(task.description || task.dueDate) &&
            <div className="flex justify-between mt-2">

                {/* Expand icon */}

                <div className="text-light">
                    {!open && task.description &&
                        <ExpandIcon size={14} />
                    }
                </div>

                {/* DUe date icon */}
                {task.dueDate &&
                    <DueDateBadge
                        date={task.dueDate}
                        classNames="mb-1"
                    />
                }
            </div>
        }
    </>

    //  Draggable version
    if (sortType === "index" || type === "daily") return (
        <Draggable draggableId={task.id} index={index}>
            {provided => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    key={task.id}
                    className={`group bg-medium px-4 py-2 rounded-lg relative
                        ${task.description && 'cursor-pointer'}`}
                    onClick={handleClick}
                >
                    {content}
                </div>
            )
            }
        </Draggable >
    )
    // Non-draggable version
    else return (
        <div
            key={task.id}
            className={`group bg-medium px-4 py-2 rounded-lg relative
                        ${task.description && 'cursor-pointer'}`}
            onClick={handleClick}
        >
            {content}
        </div>
    );
}

export default TaskCard;