import { lazy } from "react";
import { PathRouteProps } from 'react-router-dom';
import SnapshotProvider from "../context/snapshotContext";

const Login = lazy(() => import('../views/login'));
const Home = lazy(() => import('../views/home'));
const Trailas = lazy(() => import('../views/trailas'));
const Drivers = lazy(() => import('../views/drivers'));

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
    element: <SnapshotProvider>
      <Trailas />
    </SnapshotProvider>
  },
  {
    path: '/choferes',
    element: <SnapshotProvider>
      <Drivers />
    </SnapshotProvider>
  },
  {
    path: '*',
    element: <div>404 not found</div>
  }
];

export default routes;