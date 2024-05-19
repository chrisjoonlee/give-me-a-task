import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import { Button, Heading, View, useTheme } from "@aws-amplify/ui-react";
import { Outlet } from "react-router-dom";
import { TaskContext } from '../context/TaskContext';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

type HeaderProps = {
    signOut?: UseAuthenticator["signOut"]; //() => void;
};

const Header: React.FC<HeaderProps> = ({ signOut }) => {
    const { setUserId } = useContext(UserContext);
    const { setTasks } = useContext(TaskContext);

    const { tokens } = useTheme();

    const handleSignOut = () => {
        if (signOut) signOut();

        setUserId("");
        setTasks([]);
    }

    return (
        <div>
            {/* Header */}
            <View
                as="div"
                backgroundColor={tokens.colors.dark}
                height="72px"
                padding="1rem"
                className="fixed top-0 w-screen z-50 flex items-center justify-between sm:justify-center"
            >
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
            </View>

            {/* Outlet */}
            <View
                as="div"
                padding="2rem"
                marginTop="72px"
                maxWidth="400px"
                className="mx-auto"
            >
                <Outlet />
            </View>
        </div >
    );
}

export default Header;