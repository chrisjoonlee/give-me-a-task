import { Route, Routes } from 'react-router-dom';

import { withAuthenticator } from '@aws-amplify/ui-react';
import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import '@aws-amplify/ui-react/styles.css';

import Tasks from './components/Tasks';

type AppProps = {
  signOut?: UseAuthenticator["signOut"]; //() => void;
};

const App: React.FC<AppProps> = ({ signOut }) => {
  return (
    <div>
      <button onClick={signOut}>
        Sign out
      </button>
      <Routes>
        <Route path="/" element={<Tasks />} />
      </Routes>
    </div>
  );
};

export default withAuthenticator(App);