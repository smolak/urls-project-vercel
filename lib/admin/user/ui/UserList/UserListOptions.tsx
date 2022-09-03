import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export function UserListOptions() {
  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button
        className="inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium
        text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white
        bg-indigo-600 hover:bg-indigo-700
        focus-visible:ring-opacity-75"
      >
        Options
        <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-10 right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <PencilIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  ) : (
                    <PencilIcon className="mr-2 h-4 w-4 text-violet-400" aria-hidden="true" />
                  )}
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  ) : (
                    <TrashIcon className="mr-2 h-4 w-4 text-violet-400" aria-hidden="true" />
                  )}
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
