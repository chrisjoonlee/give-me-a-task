import { useContext } from "react";
import { Task } from "../../types";
import FormattedText from "../FormattedText";
import { RiArrowLeftSFill as LeftArrow } from "react-icons/ri";
import { RiArrowRightSFill as RightArrow } from "react-icons/ri";
import { TaskContext } from "../../context/TaskContext";
import { isList } from "../../functions";
import { PopupContext } from "../../context/PopupContext";
import { MdEdit as EditIcon } from "react-icons/md";

type NextTaskCardProps = {
    task: Task
}

const NextTaskCard = ({ task }: NextTaskCardProps) => {
    const arrowSize = 36;
    const arrowClassNames = "text-light cursor-pointer hover:text-white transition-colors";
    const disabledArrowClassNames = "text-gray-600"

    const {
        dailyTasks,
        currentDailyTaskIndex, setCurrentDailyTaskIndex
    } = useContext(TaskContext);
    const { setTaskToEdit, setShowDailyTaskList } = useContext(PopupContext);

    const handleClickLeft = () => {
        const newIndex = currentDailyTaskIndex - 1
        setCurrentDailyTaskIndex(newIndex);
        window.localStorage.setItem("currentDailyTaskIndex", JSON.stringify(newIndex));
    }

    const handleClickRight = () => {
        const newIndex = currentDailyTaskIndex + 1;
        setCurrentDailyTaskIndex(newIndex);
        window.localStorage.setItem("currentDailyTaskIndex", JSON.stringify(newIndex));
    }

    const handleClickEdit = () => {
        setTaskToEdit(task);
        setShowDailyTaskList(true);
    }

    if (dailyTasks) return (
        <div
            key={task.id}
            className="flex flex-col justify-between w-full bg-medium rounded-lg group relative"
        >
            {/* EDIT BUTTON */}
            <div>
                <div
                    onClick={handleClickEdit}
                    className="absolute right-2 top-14 hidden transition-colors p-1 rounded-full cursor-pointer text-light
                    group-hover:block hover:bg-gray-700"
                >
                    <EditIcon size={16} />
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-row items-center justify-between w-full bg-gray-600 py-1 px-3 rounded-t-lg">
                {/* Left button */}
                {task.index > 0 ?
                    <div
                        onClick={handleClickLeft}
                        className={arrowClassNames}>
                        <LeftArrow size={arrowSize} />
                    </div>
                    :
                    <div
                        className={disabledArrowClassNames}>
                        <LeftArrow size={arrowSize} />
                    </div>
                }

                {/* Number */}
                <div className="font-bold text-light">{currentDailyTaskIndex + 1}</div>

                {/* Right button */}
                {dailyTasks && task.index < dailyTasks.length - 1 ?
                    <div
                        onClick={handleClickRight}
                        className={arrowClassNames}>
                        <RightArrow size={arrowSize} />
                    </div>
                    :
                    <div
                        className={disabledArrowClassNames}>
                        <RightArrow size={arrowSize} />
                    </div>
                }
            </div>

            {/* Content */}
            <div className="px-5 py-5">
                {/* Heading */}
                <FormattedText
                    text={task.name}
                    classNames="font-bold text-light text-center"
                />

                {/* Description */}
                {task.description &&
                    <FormattedText
                        text={task.description}
                        classNames={`text-light mt-3 ${!isList(task.description) && 'text-center'}`}
                    />
                }
            </div>
        </div>
    );
}

export default NextTaskCard;