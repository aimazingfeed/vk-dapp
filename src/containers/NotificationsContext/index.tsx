import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { Modals } from 'types';

interface IContextValue {
  currentModal: Modals;
  setCurrentModal: Dispatch<SetStateAction<Modals>>;
  currentModalData: unknown;
  setCurrentModalData: Dispatch<SetStateAction<unknown>>;
}
interface NotificationsModalContextProps {
  children: ReactNode;
}

const NotificationsContext = createContext({} as IContextValue);

const NotificationsModalContext: FC<NotificationsModalContextProps> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<Modals>(Modals.init);
  const [currentModalData, setCurrentModalData] = useState<unknown[]>();
  return (
    <NotificationsContext.Provider value={{ currentModal, setCurrentModal, currentModalData, setCurrentModalData }}>
      {children}
    </NotificationsContext.Provider>
  );
};

const useNotificationsContext = () => useContext(NotificationsContext);

export { NotificationsModalContext, useNotificationsContext };
