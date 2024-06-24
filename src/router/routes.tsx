import { lazy } from "react";
import { PathRouteProps } from 'react-router-dom';

const Login = lazy(() => import('../views/login'));
const Home = lazy(() => import('../views/home'));
const Trailas = lazy(() => import('../views/trailas'));

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