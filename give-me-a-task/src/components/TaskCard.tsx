import { Text, View, useTheme } from "@aws-amplify/ui-react";
import { Task } from "../types";

type TaskCardProps = {
    task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
    const { tokens } = useTheme();

    return (
        <View
            key={task.id}
            as="div"
            backgroundColor={tokens.colors.medium}
            padding="0.5rem 1rem"
            borderRadius="8px"
        >
            <Text color={tokens.colors.light}>{task.name}</Text>
        </View>
    );
}

export default TaskCard;