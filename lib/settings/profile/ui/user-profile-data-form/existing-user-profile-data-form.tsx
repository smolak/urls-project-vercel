import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import copyToClipboard from "copy-to-clipboard";

import {
  UpdateUserProfileDataSchema,
  updateUserProfileDataSchema,
} from "../../../../user-profile-data/router/procedures/update-user-profile-data.schema";
import { generateApiKey } from "../../../../user/utils/generate-api-key";
import { api } from "../../../../../utils/api";
import { LoadingIndicator } from "../../../../core/ui/loading-indicator";
import { useRouter } from "next/router";
import { Link } from "../../../../shared/ui/link";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../../../components/ui/form";
import { UserProfileData } from "@prisma/client";
import { Input } from "../../../../components/ui/input";
import { AtSign, Copy, KeyRound, RefreshCcw } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export const ExistingUserProfileDataForm = () => {
  const { data, isSuccess, isError, isLoading } = api.userProfileData.getPrivateUserProfileData.useQuery();
  const { route } = useRouter();

  return (
    <div className="container mx-auto my-5 max-w-2xl px-0 sm:px-4">
      {isLoading && (
        <div className="flex items-center justify-center p-10">
          <LoadingIndicator label="Loading user profile data..." />
        </div>
      )}
      {isSuccess && <UserProfileDataForm {...data} />}
      {isError && (
        <div className="flex items-center justify-center p-10">
          <p>
            Something went wrong, <Link href={route}>try again</Link>.
          </p>
        </div>
      )}
    </div>
  );
};

type FormValues = Pick<UserProfileData, "apiKey" | "username">;

const UserProfileDataForm: FC<FormValues> = ({ username, apiKey }) => {
  const {
    mutate: saveUserProfileData,
    isLoading,
    isSuccess,
    error,
  } = api.userProfileData.updateUserProfileData.useMutation();

  const form = useForm<UpdateUserProfileDataSchema>({
    resolver: zodResolver(updateUserProfileDataSchema),
    defaultValues: {
      apiKey,
    },
    criteriaMode: "all",
  });

  const [generatedApiKey, setGeneratedApiKey] = useState(apiKey);
  const onSubmit = (userProfileData: UpdateUserProfileDataSchema) => saveUserProfileData(userProfileData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-10">
        <FormItem>
          <FormLabel>Username</FormLabel>
          <div className="relative mt-1 flex rounded-md shadow-sm">
            <span className="absolute inline-flex h-full items-center rounded-l-md px-3 text-sm text-gray-500">
              <AtSign size={14} />
            </span>
            <FormControl className="block w-full flex-1">
              <Input value={username} disabled className="bg-gray-100 pl-10" />
            </FormControl>
          </div>
          <FormDescription>This is your public display name.</FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API key</FormLabel>
              <div className="relative mt-1 flex rounded-md shadow-sm">
                <span className="absolute inline-flex h-full items-center rounded-l-md px-3 text-sm text-gray-500">
                  <KeyRound size={14} />
                </span>
                <FormControl className="block w-full flex-1">
                  <Input {...field} value={generatedApiKey} disabled className="bg-gray-100 pl-10" />
                </FormControl>
                <RefreshCcw
                  size={14}
                  onClick={() => setGeneratedApiKey(generateApiKey())}
                  className="absolute right-10 top-3.5 cursor-copy text-lg text-gray-400 hover:text-gray-700"
                />
                <Copy
                  size={14}
                  onClick={() => copyToClipboard(generatedApiKey)}
                  className="absolute right-3.5 top-3.5 cursor-copy text-lg text-gray-400 hover:text-gray-700"
                />
              </div>
              <FormDescription>Can only be generated.</FormDescription>
            </FormItem>
          )}
        />
        <div className="flex items-center gap-10">
          <Button type="submit">Save</Button>
          <div>
            {isLoading && <span className="mr-5 text-sm font-light text-gray-500">Saving...</span>}
            {isSuccess && <span className="mr-5 text-sm font-light text-green-700">Profile data saved</span>}
            {error?.message && <span className="mr-5 text-sm font-light text-red-600">{error.message}</span>}
          </div>
        </div>
      </form>
    </Form>
  );
};
