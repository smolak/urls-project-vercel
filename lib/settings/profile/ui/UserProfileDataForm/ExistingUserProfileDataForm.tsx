import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import copyToClipboard from "copy-to-clipboard";

import { BsKey } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { useSaveUserProfileData } from "../../../../user-profile-data/hooks/useSaveUserProfileData";
import { updateUserProfileDataPayloadSchema } from "../../../../user-profile-data/handlers/userProfileDataUpsertHandler/payload.schema";
import { generateApiKey } from "../../../../user/utils/generateApiKey";
import { useGetPrivateUserProfileData } from "../../../../user-profile-data/hooks/useGetPrivateUserProfileData";
import { LoadingIndicator } from "../../../../core/ui/LoadingIndicator";
import { useRouter } from "next/router";
import { Link } from "../../../../shared/ui/Link";

export const ExistingUserProfileDataForm = () => {
  const { data, isSuccess, isError, isLoading } = useGetPrivateUserProfileData();
  const { route } = useRouter();

  return (
    <div className="container mx-auto my-5 px-4 max-w-2xl">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg min-h-[395px]">
        {isLoading && (
          <div className="flex justify-center items-center p-10">
            <LoadingIndicator title="Loading user profile data..." />
          </div>
        )}
        {isSuccess && <Form {...data} />}
        {isError && (
          <div className="flex justify-center items-center p-10">
            <p>
              Something went wrong, <Link href={route}>try again</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface FormValues {
  username: string;
  apiKey: string;
}

const Form: FC<FormValues> = ({ username, apiKey }) => {
  const { mutate: saveUserProfileData, isLoading, isSuccess, error } = useSaveUserProfileData();

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      username,
      apiKey,
    },
    criteriaMode: "all",
    resolver: zodResolver(updateUserProfileDataPayloadSchema),
  });
  const [generatedApiKey, setGeneratedApiKey] = useState(apiKey);

  const onSubmit = async (userProfileData: FormValues) => {
    saveUserProfileData(userProfileData);
  };

  return (
    <>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Edit your profile data</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Your username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 flex rounded-md shadow-sm relative">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                    @
                  </span>

                  <input
                    {...register("username")}
                    className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200"
                    required={true}
                    type="text"
                    id="username"
                    disabled
                    placeholder={username}
                  />
                </div>
                <p>Username once set, can&apos;t be changed.</p>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Set API key</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  API key (can only be generated)
                </label>
                <div className="mt-1 flex rounded-md shadow-sm relative">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                    <BsKey />
                  </span>

                  <input
                    {...register("apiKey")}
                    className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 bg-gray-200 sm:text-sm"
                    required={true}
                    type="text"
                    id="apiKey"
                    value={generatedApiKey}
                    disabled
                  />
                  <MdContentCopy
                    onClick={() => copyToClipboard(generatedApiKey)}
                    className="absolute right-2.5 top-2.5 text-lg text-gray-400 hover:text-gray-700 cursor-copy"
                  />
                </div>
                <button type="button" onClick={() => setGeneratedApiKey(generateApiKey())}>
                  Generate
                </button>
              </dd>
            </div>
          </dl>
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          {isLoading && <span className="mr-5 text-sm text-gray-500 font-light">Saving...</span>}
          {isSuccess && <span className="mr-5 text-sm text-green-700 font-light">Profile data saved</span>}
          {error?.response?.data && (
            <span className="mr-5 text-sm text-red-600 font-light">{error.response.data.reason}</span>
          )}
          <button
            type="submit"
            className="w-[100px] inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};
