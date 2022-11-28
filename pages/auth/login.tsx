import { useSession, signIn } from "next-auth/react";
import { BsGithub } from "react-icons/bs";
import { useRouter } from "next/router";
import Head from "next/head";

const providers = [
  {
    name: "github",
    displayName: "GitHub",
    Icon: BsGithub,
  },
];

const Login = () => {
  const { data: session, status } = useSession();
  const { push } = useRouter();

  if (status === "loading") return <div>Checking Authentication...</div>;

  if (session) {
    setTimeout(() => {
      push("/");
    }, 5000);

    return <h2>You are signed in and will be redirected to homepage now.</h2>;
  }

  const handleOAuthSignIn = (provider: string) => () => signIn(provider);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex justify-center items-center h-screen">
        <div className="min-h-full max-w-md flex flex-col py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            {providers.map(({ displayName, name, Icon }) => (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm
                font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2
                focus:ring-offset-2 focus:ring-indigo-500
                disabled:bg-gray-500 disabled:hover:bg-gray-700 disabled:cursor-not-allowed"
                key={name}
                onClick={handleOAuthSignIn(name)}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Icon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Login with {displayName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
