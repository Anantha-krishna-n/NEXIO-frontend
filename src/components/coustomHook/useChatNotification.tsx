import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface UserId {
  _id: string;
}

interface Message {
  _id: string;
  userId: UserId;
  userName: string;
  message: string;
  timestamp: Date;
}

export function useChatNotification(currentPath: string) {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [shouldBlink, setShouldBlink] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPath.endsWith('/chat')) {
        setUnreadMessages(0);
        setShouldBlink(false);
      }
    }, 0);

    return () => clearTimeout(timer); 
  }, [currentPath]);

  const handleNewMessage = useCallback((message: Message) => {
    const lastPart = currentPath.split('/').pop();

    if (lastPart !== 'chat') {
      toast(`${message.userName}: ${message.message}`, {
        position: 'bottom-left',
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px',
        },
      });

      setUnreadMessages((prev) => prev + 1);
      setShouldBlink(true);
    }
  }, [currentPath]);

  return {
    unreadMessages,
    shouldBlink,
    handleNewMessage,
    resetNotifications: () => {
      setUnreadMessages(0);
      setShouldBlink(false);
    },
  };
}