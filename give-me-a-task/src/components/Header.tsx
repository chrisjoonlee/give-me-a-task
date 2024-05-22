import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import { Button, Heading, useTheme } from "@aws-amplify/ui-react";
import { Outlet } from "react-router-dom";
import { TaskContext } from '../context/TaskContext';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

type HeaderProps = {
    signOut?: UseAuthenticator["signOut"]; //() => void;
};

const Header: React.FC<HeaderProps> = ({ signOut }) => {
    const { setUserId } = useContext(UserContext);
    const { setTasksByIndex, setTasksByDueDate } = useContext(TaskContext);

    const { tokens } = useTheme();

    const handleSignOut = () => {
        if (signOut) signOut();

        setUserId("");
        setTasksByIndex([]);
        setTasksByDueDate([]);
    }

    return (
        <div>
            {/* Header */}
            <div className="fixed top-0 w-screen flex items-center justify-between sm:justify-center bg-dark h-[72px] p-1 z-50">
                {/* For formatting */}
                <div></div>

                {/* Title */}
                <Heading
                    level={4}
                    color={tokens.colors.light}
                    className="text-center"
                >
                    Give me a task
                </Heading>

                {/* Sign out button */}
                <Button
                    onClick={handleSignOut}
                    backgroundColor={tokens.colors.dark}
                    color={tokens.colors.light}
                    className="sm:fixed sm:right-4 text-center"
                >
                    Sign out
                </Button>
            </div>

            {/* Outlet */}
            <div
                className="mx-auto p-4 h-[calc(100vh-72px)] pt-[72px] w-screen"
            >
                <Outlet />
            </div>
        </div >
    );
}

export default Header;