import { useContext } from "react";
import { PopupContext } from "../context/PopupContext";
import { Task } from "../types";
import { MdEdit as EditIcon } from "react-icons/md";

type EditButtonProps = {
    task: Task
}

const EditButton = ({ task }: EditButtonProps) => {
    const { setTaskToEdit } = useContext(PopupContext);

    return (
        <div>
            {/* EDIT BUTTON */}
            <div
                onClick={() => setTaskToEdit(task)}
                className="absolute right-2 hidden transition-colors p-1 rounded-full cursor-pointer text-light
                group-hover:block hover:bg-gray-700"
            >
                <EditIcon size={16} />
            </div>
        </div>
    );
}

export default EditButton;