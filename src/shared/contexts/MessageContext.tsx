import { createContext, useCallback, useContext, useState } from 'react';

export enum MessageType {
  Error = 'error',
  Success = 'success'
}

interface Message{
   level: 'error' | 'success';
   message: string;
}

interface MessageContextData{
    message: Message | undefined,
    showMessage: (newMessage: Message) => void;
}

const MessageContext  = createContext({} as MessageContextData);

export const useMessageContext = () => {
  return useContext(MessageContext);
};

interface MessageProviderProps{
    children: React.ReactNode
}
export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [message, setMessage] = useState<Message|undefined>(undefined);

  const showMessage = useCallback((newMessage : Message) => {
    setMessage(newMessage);
    setTimeout(() => setMessage(undefined), message?.level == 'error' ? 3500 : 2500 );
  },[]);

  return (
    <MessageContext.Provider value={{message , showMessage}}>
      {children}
    </MessageContext.Provider>
  );

};