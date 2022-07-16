import { FC, PropsWithChildren, useEffect, useState } from "react";
import { LogoutButton } from "../auth/LogoutButton";

export const LoggedInUserLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isOnClient, setIsOnClient] = useState(false);

  useEffect(() => {
    setIsOnClient(true);
  }, []);

  return (
    <>
      <div>{isOnClient && <LogoutButton />}</div>
      <main>{children}</main>
    </>
  );
};
