import { createContext, useEffect, useState } from 'react';

export const NotificationCountContext = createContext<{
  notificationCount: number;
}>({ notificationCount: 0 });

export function NotificationCountContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationCount, setNotificationCount] = useState(0);

  return (
    <NotificationCountContext.Provider value={{ notificationCount }}>
      {children}
    </NotificationCountContext.Provider>
  );
}
