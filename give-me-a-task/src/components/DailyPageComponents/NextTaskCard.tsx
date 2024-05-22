import { useContext, useEffect, useState } from "react";
import { Task } from "../../types";
import FormattedText from "../FormattedText";
import { RiArrowLeftSFill as LeftArrow } from "react-icons/ri";
import { RiArrowRightSFill as RightArrow } from "react-icons/ri";
import { TaskContext } from "../../context/TaskContext";

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

    return (
        <div
            key={task.id}
            className="flex flex-col items-center justify-between w-full text-center bg-medium rounded-lg"
        >
            <div className="flex flex-row justify-between w-full bg-gray-600 py-1 px-3 rounded-t-lg">
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

                {/* Right button */}
                {task.index < dailyTasks.length - 1 ?
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
            <div>
                <div className="px-5 py-5">
                    {/* Heading */}
                    <FormattedText
                        text={task.name}
                        classNames="font-bold text-light"
                    />

                    {/* Description */}
                    {task.description &&
                        <FormattedText
                            text={task.description}
                            classNames="text-light mt-3"
                        />
                    }
                </div>
            </div>
        </div>
    );
}

export default NextTaskCard;