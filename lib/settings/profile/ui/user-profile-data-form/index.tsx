import { NewUserProfileDataForm } from "./new-user-profile-data-form";
import { ExistingUserProfileDataForm } from "./existing-user-profile-data-form";
import { User } from "@prisma/client";
import { FC } from "react";

interface UserProfileDataFormProps {
  userRole: User["role"];
}

export const UserProfileDataForm: FC<UserProfileDataFormProps> = ({ userRole }) => {
  const isNewUser = userRole === "NEW_USER";

  return (
    <>
      {isNewUser && <NewUserProfileDataForm />}
      {!isNewUser && <ExistingUserProfileDataForm />}
    </>
  );
};
