import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Profile from '../pages/profile';
import Login from '../pages/login';
import Signup from '../pages/singhup';
import HomePage from '../pages/homepage';
import Agri from './agriculture';
import Kisan from "./kisan_bazar"
import Update_profile from '../pages/update_profile';
import User_profile from "../pages/User_profile"
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'profile',
        element: <Profile />,
      },
      {
       path:"update_profile",
       element:<Update_profile/>
      },
      {
        path:'login',
        element: <Login />,
      },{
        path:'signup',
        element: <Signup />
      },{
        path:'/',
        element:<HomePage/>
      },{
         path:"/agri",
         element:<Agri/>
      },{
        path:"kisan",
        element:<Kisan/>
      },{
        path:"user_profile",
        element:<User_profile/>
      }
    ],
  },
]);

export default router;
