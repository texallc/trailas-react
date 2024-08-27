import { Route, Routes } from 'react-router-dom';
import RouterChecker from './routerCheker';
import routes from './routes';

const MyRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RouterChecker />}>
        {
          routes.map(r => (
            <Route key={r.path} {...r} />
          ))
        }
      </Route>
    </Routes>
  );
};

export default MyRouter;