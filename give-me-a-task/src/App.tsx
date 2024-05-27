import { Route, Routes } from 'react-router-dom';

import { withAuthenticator } from '@aws-amplify/ui-react';
import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import '@aws-amplify/ui-react/styles.css';
import { FetchUserAttributesOutput, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

import { useContext, useEffect } from 'react';
import { UserContext } from './context/UserContext';
import Header from './components/Header';
import { TaskContext } from './context/TaskContext';
import { fetchDailyTasks, fetchTasks } from './functions';
import HomePage from './components/HomePage';

type AppProps = {
  signOut?: UseAuthenticator["signOut"]; //() => void;
};

const App: React.FC<AppProps> = ({ signOut }) => {

  const { userId, setUserId } = useContext(UserContext);
  const {
    setTasksByIndex, setTasksByDueDate,
    dailyTasks, setDailyTasks,
    setCurrentDailyTaskIndex } = useContext(TaskContext);

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
        .then(tasks => {
          if (tasks) setTasksByIndex(tasks);
        });

      // Fetch tasks by due date
      fetchTasks(userId, "dueDate")
        .then(tasks => {
          if (tasks) setTasksByDueDate(tasks);
        });

      // Fetch daily tasks
      fetchDailyTasks(userId)
        .then(tasks => {
          if (tasks) setDailyTasks(tasks);
        })
    }
    else console.log("TaskList.tsx: No user ID");
  }, [userId]);

  useEffect(() => {
    // Get current daily task index
    if (dailyTasks && dailyTasks.length) {
      const currentIndex = window.localStorage.getItem("currentDailyTaskIndex");
      if (currentIndex) setCurrentDailyTaskIndex(JSON.parse(currentIndex));
      else setCurrentDailyTaskIndex(-1);
    }
    else setCurrentDailyTaskIndex(-1);
  }, [dailyTasks]);

  return (
    <Routes>
      <Route element={<Header signOut={signOut} />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default withAuthenticator(App);