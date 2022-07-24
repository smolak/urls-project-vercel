import { FC } from "react";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

interface ErrorLoadingUsersProps {
  error: Error;
}

export const ErrorLoadingUsers: FC<ErrorLoadingUsersProps> = ({ error }) => {
  return (
    <div className="p-5 sm:py-20 sm:px-0">
      <h1 className="text-2xl mb-8 tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
        <span className="inline">Something went wrong 😞</span>{" "}
      </h1>
      <div className="lg:w-3/4 mb-8">
        {error.stack ? (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-red-100 px-4 py-2 text-left text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75">
                  <span>
                    <strong>Error:</strong> {error.message}
                  </span>
                  <ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-red-500`} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  {error.stack &&
                    error.stack.split("\n").map((line, i) => (
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
          <Link href="/admin/users">
            <a className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-2 md:text-lg md:px-5">
              Try again
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
