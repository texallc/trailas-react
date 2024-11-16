import { lazy } from "react";
import { PathRouteProps } from 'react-router-dom';
import SnapshotProvider from "../context/snapshotContext";
import GetProvider from "../context/getContext";
import FormControlProvider from "../context/formControl";
import ShoppingCart from "../views/shoppingCart";

const Login = lazy(() => import('../views/login'));
const Home = lazy(() => import('../views/home'));
const Trailas = lazy(() => import('../views/trailas'));
const Drivers = lazy(() => import('../views/drivers'));
const Users = lazy(() => import('../views/users'));
const Categories = lazy(() => import('../views/categories'));
const Products = lazy(() => import('../views/products'));
const Inventories = lazy(() => import('../views/inventories'));
const Sales = lazy(() => import('../views/sales'));
const Movements = lazy(() => import('../views/movements'));

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
    element: <GetProvider>
      <Users />
    </GetProvider>
  },
  {
    path: '/categorias',
    element: <GetProvider>
      <Categories />
    </GetProvider>
  },
  {
    path: '/productos',
    element: <GetProvider>
      <Products />
    </GetProvider>
  },
  {
    path: '/inventarios',
    element: <GetProvider>
      <Inventories />
    </GetProvider>
  },
  {
    path: '/ventas',
    element: <GetProvider>
      <Sales />
    </GetProvider>
  },
  {
    path: '/movimientos',
    element: <GetProvider>
      <Movements />
    </GetProvider>
  },
  {
    path: '/carrito-de-compras',
    element: <GetProvider>
      <ShoppingCart />
    </GetProvider>
  },
  {
    path: '*',
    element: <div>404 not found</div>
  }
];

export default routes;