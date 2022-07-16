import { PropsWithChildren, useEffect, useState } from "react";
import { LogoutButton } from "../auth/logout-button";

export default function BaseLayout({ children }: PropsWithChildren) {
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
}
