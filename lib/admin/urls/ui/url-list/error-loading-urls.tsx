import { FC } from "react";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { TRPCClientErrorLike } from "@trpc/client";

interface ErrorLoadingUsersProps {
  error: TRPCClientErrorLike<any>;
}

export const ErrorLoadingUrls: FC<ErrorLoadingUsersProps> = ({ error }) => {
  return (
    <div className="p-5 sm:px-0 sm:py-20">
      <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
        <span className="inline">Something went wrong 😞</span>{" "}
      </h1>
      <div className="mb-8 lg:w-3/4">
        {error.data.stack ? (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-red-100 px-4 py-2 text-left text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75">
                  <span>
                    <strong>Error:</strong> {error.message}
                  </span>
                  <ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-red-500`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                  {error.data.stack &&
                    (error.data.stack as unknown as string).split("\n").map((line, i) => (
                      <p className="py-0.5" key={i}>
                        {line}
                      </p>
                    ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ) : (
          <p className="flex w-full justify-between rounded-lg bg-red-100 px-4 py-2 text-left text-sm font-medium text-red-900">
            {error.message}
          </p>
        )}
      </div>
      <div className="flex">
        <div className="rounded-md shadow">
          <Link
            href="/admin/users"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:px-5 md:py-2 md:text-lg"
          >
            Try again
          </Link>
        </div>
      </div>
    </div>
  );
};
