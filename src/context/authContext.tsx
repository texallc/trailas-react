import { useEffect, useState, useContext, createContext, FC, ReactNode } from 'react';
import FullLoader from '../components/fullLoader';
import { User as UserAuth, onIdTokenChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { User } from "../interfaces/models/user";
import { get } from "../services/http";
import useAbortController from "../hooks/useAbortController";
import { message } from "antd";

interface Auth {
  user: User | null;
  userAuth: UserAuth | null;
  loading: boolean;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<Auth>({
  user: null,
  userAuth: null,
  loading: true,
});

export const AuthProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userAuth, setUserAuth] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const abortController = useAbortController();

  useEffect(() => {
    const uns = onIdTokenChanged(auth, async (_userAuth) => {
      let _user: User | null = null;

      try {
        if (_userAuth) {
          _user = await get<User>(`/usuarios/get-by-uid?uid=${_userAuth.uid}`, abortController.current!);
        }
      } catch (error) {
        console.log(error);
        message.error("Error al obtener la información del usuario autentificado");
      }

      setUser(_user);
      setUserAuth(_userAuth);
      setLoading(false);
    });

    return () => {
      uns();
    };
  }, [abortController]);

  if (loading) return <FullLoader />;

  return <AuthContext.Provider value={{ user, userAuth, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);