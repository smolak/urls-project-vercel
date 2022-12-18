import { useQuery } from "@tanstack/react-query";
import {
  getPrivateUserProfileData,
  GetPrivateUserProfileDataError,
  GetPrivateUserProfileDataSuccess,
} from "../services/getPrivateUserProfileData";

type ExistsValue = "unknown" | boolean;
type ExistenceCheck =
  | {
      isChecking: true;
      exists: undefined;
    }
  | {
      isChecking: false;
      exists: ExistsValue;
    };

export const useCheckIfUserProfileDataExists = (): ExistenceCheck => {
  // It doesn't matter if it's the private profile data or public private data is fetched.
  // It's about checking if it exists only, as both are coming from the same source

  const { error, isFetched, data } = useQuery<GetPrivateUserProfileDataSuccess, GetPrivateUserProfileDataError>(
    ["privateUserProfile"],
    () => getPrivateUserProfileData(),
    // This check is meant to be short, so no retries.
    { retry: false }
  );

  const existenceUnknown = error !== null && error?.response?.status !== 404;

  if (isFetched === false) {
    return {
      isChecking: true,
      exists: undefined,
    };
  }

  let exists: ExistsValue = "unknown";

  if (!existenceUnknown) {
    exists = data !== undefined;
  }

  return {
    isChecking: false,
    exists,
  };
};
