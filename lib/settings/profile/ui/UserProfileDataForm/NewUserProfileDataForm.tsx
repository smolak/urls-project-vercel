import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import { ChangeEvent, useEffect, useState } from "react";
import clsx from "clsx";
import copyToClipboard from "copy-to-clipboard";
import { generateApiKey } from "../../../../user/utils/generateApiKey";
import { createUserProfileDataPayloadSchema } from "../../../../user/handlers/userProfileDataUpsertHandler/payload.schema";
import { useSaveUserProfileData } from "../../../../user/ui/hooks/useSaveUserProfileData";
import { usernameCheckHandlerPayloadSchema } from "../../../../user/handlers/usernameCheckHandler/payload.schema";
import { CgCheckO, CgUnavailable } from "react-icons/cg";
import { BsKey } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { LoadingIndicator } from "../../../../core/ui/LoadingIndicator";
import { useCheckIfUserProfileDataExists } from "../../../../user/ui/hooks/useCheckIfUserProfileDataExists";
import { usernameCheck } from "../../../../user/services/usernameCheck";
import { useRouter } from "next/router";
import { Link } from "../../../../shared/ui/Link";
import { router } from "next/client";

interface FormValues {
  username: string;
  apiKey: string;
}

const usernameExamples = ["ThomasAnderson", "__I_AM_ROBOT__", "JeanneDArc"];

export const NewUserProfileDataForm = () => {
  const { isChecking, exists } = useCheckIfUserProfileDataExists();
  const { route, push } = useRouter();

  /**
   * As a new user, one should not have user profile data yet.
   *
   * If one does, and is logged in as role === NEW_USER, then something is wrong.
   * Most likely the profile data was created when user was still logged in as NEW_USER,
   * and is trying to enter this page. The problem is that profile data form for new users
   * allows to set username. You can't do it when it's already set (user profile data exists).
   *
   * Only if user profile data does not exist, can such a user enter this form.
   *
   * There is also a case when system won't be able to verify if data exists or not,
   * hence the 'unknown' return value from the check. Reason is that different from 404 error
   * is being returned in the check.
   *
   * Normally that should not happen, because the role is checked.
   * This is just me being extra careful from the UX and data perspective.
   */

  return (
    <div className="container mx-auto my-5 px-4 max-w-2xl">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg min-h-[395px]">
        {isChecking && (
          <div className="flex justify-center items-center p-10">
            <p>Checking data...</p>
            <LoadingIndicator title="Loading user profile data..." />
          </div>
        )}
        {exists === "unknown" && (
          <div className="flex justify-center items-center p-10">
            <p>
              Couldn&apos;t check the data. <Link href={route}>Try again</Link>.
            </p>
          </div>
        )}
        {exists === true && (
          <div className="flex justify-center items-center p-10">
            <p>
              It looks like your user status doesn&apos;t allow you to manage your profile yet. Log out and login again,
              and you will be able to do so.
            </p>
          </div>
        )}
        {exists === false && <Form />}
      </div>
    </div>
  );
};

const Form = () => {
  const { push } = useRouter();
  const { mutate: saveUserProfileData, isLoading, isSuccess, error } = useSaveUserProfileData();

  // If the data is saved successfully, proceed to homepage
  if (isSuccess) {
    push("/");
  }

  const apiKey = generateApiKey();

  const { register, clearErrors, trigger, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      username: "",
      apiKey,
    },
    criteriaMode: "all",
    resolver: zodResolver(createUserProfileDataPayloadSchema),
  });

  const [isUsernameAvailable, setIsUsernameAvailable] = useState<null | boolean>(null);
  const [usernameIsValid, setUsernameIsValid] = useState<null | boolean>(null);
  const [usernamePlaceholder, setUsernamePlaceholder] = useState("");
  const [generatedApiKey, setGeneratedApiKey] = useState(apiKey);

  useEffect(() => {
    setUsernamePlaceholder(usernameExamples.sort(() => Math.random() - 0.5)[0]);
  }, []);

  const onSubmit = async (userProfileData: FormValues) => {
    saveUserProfileData(userProfileData);
  };

  const checkUsernameAvailability = async (username: string) => {
    const validationResult = usernameCheckHandlerPayloadSchema.safeParse({ username });

    if (validationResult.success) {
      clearErrors("username");

      const { usernameAvailable } = await usernameCheck(username);

      setUsernameIsValid(true);
      setIsUsernameAvailable(usernameAvailable);
    } else {
      setUsernameIsValid(false);

      await trigger("username");
    }
  };

  const delayedCheckUsernameAvailability = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    await checkUsernameAvailability(e.target.value);
  }, 500);

  const usernameDescriptionClassNames = clsx({
    "text-green-700": usernameIsValid === true,
    "text-red-600": usernameIsValid === false,
  });

  return (
    <>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Welcome to urlshare.me</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">There are couple of things you need to do first.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Choose a username</dt>
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
                    placeholder={usernamePlaceholder}
                    onChange={delayedCheckUsernameAvailability}
                  />
                  {isUsernameAvailable === false && (
                    <CgUnavailable className="absolute right-2.5 top-2.5 text-lg text-red-600" />
                  )}
                  {isUsernameAvailable && <CgCheckO className="absolute right-2.5 top-2.5 text-lg text-green-700" />}
                </div>
                <p className={usernameDescriptionClassNames}>4 to 15 characters long, a-z, A-Z, 0-9 and _ only.</p>
                {isUsernameAvailable === false && <p>Username taken, pick a different one.</p>}
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
          {error?.response?.data && (
            <span className="mr-5 text-sm text-red-600 font-light">{error.response.data.reason}</span>
          )}
          <button
            disabled={isUsernameAvailable === false || isSuccess}
            type="submit"
            className="w-[150px] inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save and finish
          </button>
        </div>
      </form>
    </>
  );
};
