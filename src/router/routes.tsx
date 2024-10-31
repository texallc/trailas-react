import { lazy } from "react";
import { PathRouteProps } from 'react-router-dom';
import SnapshotProvider from "../context/snapshotContext";

const Login = lazy(() => import('../views/login'));
const Home = lazy(() => import('../views/home'));
const Trailas = lazy(() => import('../views/trailas'));
const Drivers = lazy(() => import('../views/drivers'));
const Users = lazy(() => import('../views/users'));
const Categories = lazy(() => import('../views/categories'));
const Products = lazy(() => import('../views/products'));
const Inventories = lazy(() => import('../views/inventories'));

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
    path: '/usuarios',
    element: <Users />
  },
  {
    path: '/categorias',
    element: <Categories />
  },
  {
    path: '/productos',
    element: <Products />
  },
  {
    path: '/inventarios',
    element: <Inventories />
  },
  {
    path: '*',
    element: <div>404 not found</div>
  }
];

export default routes;