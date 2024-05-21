import { Route, Routes } from 'react-router-dom';

import { withAuthenticator } from '@aws-amplify/ui-react';
import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import '@aws-amplify/ui-react/styles.css';
import { FetchUserAttributesOutput, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

import TasksPage from './components/TasksPage';
import { useContext, useEffect } from 'react';
import { UserContext } from './context/UserContext';
import Header from './components/Header';
import { TaskContext } from './context/TaskContext';
import { fetchTasks, fetchTasksByIndex } from './functions';

type AppProps = {
  signOut?: UseAuthenticator["signOut"]; //() => void;
};

const App: React.FC<AppProps> = ({ signOut }) => {

  const { userId, setUserId } = useContext(UserContext);
  const {
    tasksByIndex, setTasksByIndex,
    tasksByDueDate, setTasksByDueDate,
    sortType, setSortType
  } = useContext(TaskContext);

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

  // Fetch user info
  useEffect(() => {
    fetchCurrentUsername();
    getUserAttributes();
  }, []);

  // Fetch tasks
  useEffect(() => {
    if (userId) {
      // Fetch tasks by index
      fetchTasks(userId, "index")
        .then(res => {
          if (res) setTasksByIndex(res);
        });

      // Fetch tasks by due date
      fetchTasks(userId, "dueDate")
        .then(res => {
          if (res) setTasksByDueDate(res);
        });
    }
    else console.log("TaskList.tsx: No user ID");
  }, [userId]);

  return (
    <Routes>
      <Route element={<Header signOut={signOut} />}>
        <Route path="/" element={<TasksPage />} />
      </Route>
    </Routes>
  );
};

export default withAuthenticator(App);