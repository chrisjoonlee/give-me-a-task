import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx'

import { UserProvider } from './context/UserContext.tsx';
import { TaskProvider } from './context/TaskContext.tsx';
import { PopupProvider } from './context/PopupContext.tsx';

import './index.css'

import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

import { Theme, ThemeProvider } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';

const theme: Theme = {
  name: 'my-theme',
  tokens: {
    colors: {
      white: { value: '#ffffff' },
      light: { value: '#b6c2cf' },
      medium: { value: '#22272b' },
      dark: { value: '#101204' }
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <TaskProvider>
        <PopupProvider>
          <ThemeProvider theme={theme}>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </ThemeProvider>
        </PopupProvider>
      </TaskProvider>
    </UserProvider>
  </BrowserRouter>
)
