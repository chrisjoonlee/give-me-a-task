import { Task } from "../../types.ts";
import { HiOutlineMenuAlt2 as ExpandIcon } from "react-icons/hi";
import { useContext, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { TaskContext } from "../../context/TaskContext.tsx";
import DueDateBadge from "./DueDateBadge.tsx";
import EditButton from "./EditButton.tsx";
import FormattedText from "../FormattedText.tsx";

type TaskCardProps = {
    index: number;
    task: Task;
}

const TaskCard = ({ index, task }: TaskCardProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { sortType } = useContext(TaskContext);

    const handleClick = () => {
        if (task.description) {
            setOpen(!open);
        }
    }

    const content = <>
        {/* Edit icon */}
        <EditButton task={task} />

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
                    <DueDateBadge date={task.dueDate} />
                }
            </div>
        }
    </>

    //  Draggable version
    if (sortType === "index") return (
        <Draggable draggableId={task.id} index={index}>
            {provided => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    key={task.id}
                    className={`group bg-medium pl-4 pr-2 py-2 rounded-lg relative
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
            className={`group bg-medium pl-4 pr-2 py-2 rounded-lg relative
                        ${task.description && 'cursor-pointer'}`}
            onClick={handleClick}
        >
            {content}
        </div>
    );
}

export default TaskCard;