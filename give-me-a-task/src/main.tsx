import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx'

import { UserProvider } from './context/UserContext.tsx';
import { TaskProvider } from './context/TaskContext.tsx';

import './index.css'

import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <TaskProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </TaskProvider>
    </UserProvider>
  </BrowserRouter>
)