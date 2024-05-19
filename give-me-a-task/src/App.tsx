import { Route, Routes } from 'react-router-dom';

import { withAuthenticator } from '@aws-amplify/ui-react';
import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import '@aws-amplify/ui-react/styles.css';
import { FetchUserAttributesOutput, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

import TasksPage from './components/TasksPage';
import { useContext, useEffect } from 'react';
import { UserContext } from './context/UserContext';
import { TaskContext } from './context/TaskContext';

type AppProps = {
  signOut?: UseAuthenticator["signOut"]; //() => void;
};

const App: React.FC<AppProps> = ({ signOut }) => {

  const { userId, setUserId } = useContext(UserContext);
  const { setTasks } = useContext(TaskContext);

  // Fetch username
  const fetchCurrentUsername = async () => {
    try {
      const { username } = await getCurrentUser();
      console.log(`Username: ${username}`);
      return username;
    }
    catch (error) {
      console.log("Error fetching username:", error);
      return "";
    }
  }

  const getUserAttributes = async () => {
    try {
      const attributes: FetchUserAttributesOutput = await fetchUserAttributes();
      console.log("User attributes:", attributes);

      if (attributes.sub) setUserId(attributes.sub);
    }
    catch (error) {
      console.log("Error fetching user attributes:", error);
      return "";
    }
  }

  const handleSignOut = () => {
    if (signOut) signOut();

    setUserId("");
    setTasks([]);
  }

  useEffect(() => {
    fetchCurrentUsername();
    getUserAttributes();
  }, []);

  return (
    <div>
      <button onClick={handleSignOut}>
        Sign out
      </button>
      <Routes>
        <Route path="/" element={<TasksPage />} />
      </Routes>
    </div>
  );
};

export default withAuthenticator(App);