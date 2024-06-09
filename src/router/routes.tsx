import { lazy } from "react";
import { PathRouteProps } from 'react-router-dom';
import Trailas from "../views/trailas";
import Home from "../views/home";

const Login = lazy(() => import('../views/login'));

const routes: PathRouteProps[] = [
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/inicio',
    element: <Home />
  },
  {
    path: '/trailas',
    element: <Trailas />
  },
  {
    path: '*',
    element: <div>404 not found</div>
  }
];

export default routes;