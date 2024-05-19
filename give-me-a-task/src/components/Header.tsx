import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import { Button, View } from "@aws-amplify/ui-react";
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

    const handleSignOut = () => {
        if (signOut) signOut();

        setUserId("");
        setTasks([]);
    }

    return (
        <div>
            <View as="div">
                <Button onClick={handleSignOut}>
                    Sign out
                </Button>
            </View>

            <Outlet />
        </div>
    );
}

export default Header;