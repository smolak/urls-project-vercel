import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Login2() {
  const { data: session } = useSession();

  return (
    <div>
      {!session && (
        <div>
          Not sign in.{" "}
          <Link href="/api/auth/signin">
            <a>Sign in</a>
          </Link>
          .
        </div>
      )}
      {session && (
        <div>
          Signed in as {session.user.email}
          <br />
          You can now access ... <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
}
