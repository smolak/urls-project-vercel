import { FC } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { UserProfileData } from "@prisma/client";

interface UserImageProps {
  username: UserProfileData["username"];
  image?: UserProfileData["image"];
  size?: "big" | "small";
  className?: string;
}

const imageClasses = new Map<UserImageProps["size"], string>();
imageClasses.set("big", "h-[70px] w-[70px]");
imageClasses.set("small", "h-10 w-10");

const placeholderClasses = new Map<UserImageProps["size"], string>();
placeholderClasses.set("big", "h-[60px] w-[60px]");
placeholderClasses.set("small", "h-8 w-8");

export const UserImage: FC<UserImageProps> = ({ username, image, size = "small", className }) => {
  return image ? (
    <img
      className={clsx(imageClasses.get(size), "rounded-full p-0.5 hover:ring", className)}
      src={image}
      alt={username || ""}
    />
  ) : (
    <span className={placeholderClasses.get(size)}>
      <UserIcon
        className={clsx(placeholderClasses.get(size), "rounded-full text-gray-400 hover:ring p-1", className)}
      />
    </span>
  );
};
