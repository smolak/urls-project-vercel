import { signOut } from "next-auth/react";

export const LogoutButton = () => <button onClick={() => signOut()}>Logout</button>;
