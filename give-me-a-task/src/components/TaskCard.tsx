import { Text, useTheme } from "@aws-amplify/ui-react";
import { Task } from "../types.ts";
import { HiOutlineMenuAlt2 as ExpandIcon } from "react-icons/hi";
import React, { useContext, useState } from "react";
import { MdEdit as EditIcon } from "react-icons/md";
import { PopupContext } from "../context/PopupContext";
import { Draggable } from "@hello-pangea/dnd";

type TaskCardProps = {
    index: number;
    task: Task;
}

const TaskCard = ({ index, task }: TaskCardProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { setTaskToEdit } = useContext(PopupContext);

    const { tokens } = useTheme();

    const handleClick = () => {
        if (task.description) {
            setOpen(!open);
        }
    }

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {provided => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    key={task.id}
                    className={`relative group bg-medium px-4 py-2 rounded-lg
                        ${task.description && 'cursor-pointer'}`}
                    onClick={handleClick}
                >
                    {/* Edit icon */}
                    <div
                        onClick={() => setTaskToEdit(task)}
                        className={`absolute right-2 hidden group-hover:block hover:bg-gray-700 transition-colors p-1 rounded-full cursor-pointer text-light`}
                    >
                        <EditIcon size={16} />
                    </div>

                    {/* Heading */}
                    <Text
                        color={tokens.colors.light}
                        className={`${open && 'font-bold'}`}
                    >
                        {/* {task.name} */}
                        {task.name.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </Text>

                    {/* Description */}
                    {open && task.description &&
                        <Text
                            color={tokens.colors.light}
                            marginTop="0.8rem"
                        >
                            {task.description.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </Text>
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
                                <div className="text-light text-xs">
                                    Due {formatDate(task.dueDate)}
                                </div>
                            }
                        </div>
                    }
                </div>
            )
            }

        </Draggable >
    );
}

export default TaskCard;