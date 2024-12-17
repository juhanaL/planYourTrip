import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WeatherMap from './components/WeatherMap';
import BaseLayout from './components/BaseLayout';
import TodoList from './components/TodoList';

import './App.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <BaseLayout />,
      children: [
        {
          index: true,
          element: <>Placeholder</>,
        },
        {
          path: 'weathermap',
          element: <WeatherMap />,
        },
        {
          path: 'todo',
          element: <TodoList />,
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

const App = () => {
  return <RouterProvider future={{ v7_startTransition: true }} router={router} />;
};

export default App;
