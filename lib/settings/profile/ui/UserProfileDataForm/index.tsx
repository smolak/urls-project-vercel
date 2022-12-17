import { NewUserProfileDataForm } from "./NewUserProfileDataForm";
import { ExistingUserProfileDataForm } from "./ExistingUserProfileDataForm";
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
