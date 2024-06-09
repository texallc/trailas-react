import { useState, useContext, createContext, FC, ReactNode, Dispatch, SetStateAction } from 'react';
import { Traila } from "../interfaces/trailas";

interface Props {
  children: ReactNode;
}

interface TrailaContext {
  trailas: Traila[];
  setTrailas: Dispatch<SetStateAction<Traila[]>>;
}

const trailaContext = createContext<TrailaContext>({
  trailas: [],
  setTrailas: () => { },
});

export const TrailaProvider: FC<Props> = ({ children }) => {
  const [trailas, setTrailas] = useState<Traila[]>([]);

  return <trailaContext.Provider value={{ trailas, setTrailas }}>{children}</trailaContext.Provider>;
};

export const useTraila = () => useContext(trailaContext);