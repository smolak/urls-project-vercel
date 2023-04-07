import { FC } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";

interface UserImageProps {
  image?: User["image"];
  name: string | null;
}

export const UserImage: FC<UserImageProps> = ({ name, image }) => {
  return image ? (
    <img className="h-10 w-10 rounded-full p-0.5 hover:ring" src={image} alt={name || ""} />
  ) : (
    <span className="h-8 w-8">
      <UserIcon className="h-8 w-8 rounded-full text-gray-400 hover:ring p-1" />
    </span>
  );
};
