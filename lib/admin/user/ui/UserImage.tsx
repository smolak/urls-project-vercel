import { FC } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";

interface UserImageProps {
  image?: User["image"];
  name: string;
}

export const UserImage: FC<UserImageProps> = ({ name, image }) => {
  return image ? (
    <img className="h-8 w-8 rounded-full" src={image} alt={name} />
  ) : (
    <span className="h-8 w-8">
      <UserIcon className="h-6 w-6 rounded-full text-gray-400" />
    </span>
  );
};
