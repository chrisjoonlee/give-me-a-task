import { Text, View, useTheme } from "@aws-amplify/ui-react";
import { Task } from "../types";
import { HiOutlineMenuAlt2 as ExpandIcon } from "react-icons/hi";
import { useContext, useState } from "react";
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

    return (
        <Draggable draggableId={task.id} index={index}>
            {provided => (
                <View
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    key={task.id}
                    as="div"
                    backgroundColor={tokens.colors.medium}
                    padding="0.5rem 1rem"
                    borderRadius="8px"
                    className={`relative group ${task.description && 'cursor-pointer'}`}
                    onClick={handleClick}
                >
                    {/* Edit icon */}
                    <View
                        as="div"
                        color={tokens.colors.light}
                        onClick={() => setTaskToEdit(task)}
                        className={`absolute right-2 hidden group-hover:block hover:bg-gray-700 transition-colors p-1 rounded-full cursor-pointer`}
                    >
                        <EditIcon size={16} />
                    </View>

                    {/* Heading */}
                    <Text
                        color={tokens.colors.light}
                        className={`${open && 'font-bold'}`}
                    >
                        {task.name}
                    </Text>

                    {/* Description */}
                    {open && task.description &&
                        <Text
                            color={tokens.colors.light}
                            marginTop="0.8rem"
                        >
                            {task.description}
                        </Text>
                    }

                    {/* Expand icon */}
                    {!open && task.description &&
                        <View
                            as="div"
                            color={tokens.colors.light}
                        >
                            <ExpandIcon size={14} className="mt-1" />
                        </View>
                    }
                </View>
            )
            }

        </Draggable >
    );
}

export default TaskCard;