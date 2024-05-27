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
import { CompletedTasksProvider } from './context/CompletedTasksContext.tsx';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const theme: Theme = {
  name: 'my-theme',
  tokens: {
    colors: {
      white: { value: '#ffffff' },
      light: { value: '#b6c2cf' },
      medium: { value: '#22272b' },
      dark: { value: '#101204' }
    },
    components: {
      tabs: {
        // borderColor: { value: '#22272b' },
        item: {
          color: { value: '#494e53' },
          borderColor: { value: '#494e53' },
          // fontSize: { value: '{fontSizes.xl}' },
          // fontWeight: { value: '{fontWeights.normal}' },
          paddingVertical: { value: '0.5rem' },
          _hover: {
            color: { value: '#c5ced9' },
          },
          _focus: {
            color: { value: '{colors.light}' },
          },
          _active: {
            color: { value: '#b6c2cf' },
            borderColor: { value: '{colors.light}' },
            // backgroundColor: { value: '{colors.blue.10}' },
          },
          _disabled: {
            color: { value: 'gray' },
            backgroundColor: { value: 'transparent' },
          },
        },
      },
    }
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TaskProvider>
          <PopupProvider>
            <CompletedTasksProvider>
              <ThemeProvider theme={theme}>
                <React.StrictMode>
                  <App />
                  <ReactQueryDevtools initialIsOpen={false} />
                </React.StrictMode>
              </ThemeProvider>
            </CompletedTasksProvider>
          </PopupProvider>
        </TaskProvider>
      </UserProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
