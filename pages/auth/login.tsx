import { useSession, signIn } from "next-auth/react";
import { RiGithubFill } from "react-icons/ri";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";
import { Logo } from "../../lib/shared/ui/logo";

const providers = [
  {
    name: "github",
    displayName: "GitHub",
    Icon: RiGithubFill,
  },
];

const Login = () => {
  const { data: session } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (session) {
      const path = session.user.role === "NEW_USER" ? "/settings/profile" : "/";

      window.location.replace(path);
    }
  }, [session, push]);

  const handleOAuthSignIn = (provider: string) => () => signIn(provider);

  return (
    !session && (
      <>
        <Head>
          <title>Login</title>
        </Head>
        <div className="flex justify-center items-center h-screen">
          <div className="min-h-full max-w-md flex flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md space-y-8 text-center">
              <div>
                <Logo />
                <h2 className="mt-6 text-3xl font-bold">Login to your account</h2>
              </div>
            </div>
            <div className="mt-8 space-y-6 flex justify-center">
              {providers.map(({ displayName, name, Icon }) => (
                <button type="submit" className="btn btn-primary gap-2" key={name} onClick={handleOAuthSignIn(name)}>
                  <Icon size={20} aria-hidden="true" />
                  Login with {displayName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Login;
