import { Text, View, useTheme } from "@aws-amplify/ui-react";
import { Task } from "../types";
import { HiOutlineMenuAlt2 as ExpandIcon } from "react-icons/hi";

type TaskCardProps = {
    task: Task;
    full?: boolean;
}

const TaskCard = ({ task, full = false }: TaskCardProps) => {
    const { tokens } = useTheme();

    return (
        <View
            key={task.id}
            as="div"
            backgroundColor={tokens.colors.medium}
            padding="0.5rem 1rem"
            borderRadius="8px"
            className={`${full && 'w-full text-center'}`}
        >
            {/* Heading */}
            <Text
                color={tokens.colors.light}
                className={`${full && 'font-bold'}`}
            >
                {task.name}
            </Text>

            {/* Description */}
            {full && task.description &&
                <Text
                    color={tokens.colors.light}
                    marginTop="0.8rem"
                >
                    {task.description}
                </Text>
            }

            {/* Expand icon */}
            {!full &&
                <View
                    as="div"
                    color={tokens.colors.light}
                >
                    <ExpandIcon size={14} className="mt-1" />
                </View>
            }
        </View>
    );
}

export default TaskCard;