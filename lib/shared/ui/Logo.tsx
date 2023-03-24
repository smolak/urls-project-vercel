import { RiLink } from "react-icons/ri";
import Link from "next/link";
import { IconBaseProps } from "react-icons";
import { FC } from "react";

interface LogoProps {
  iconSize?: IconBaseProps["size"];
  withName?: boolean;
  asLink?: boolean;
}

export const Logo: FC<LogoProps> = ({ iconSize, withName = false, asLink = true }) => {
  if (asLink) {
    return (
      <Link href="/" className="btn btn-ghost normal-case text-xl flex space-x-2">
        <RiLink size={iconSize} />
        {withName && <span className="font-extralight">urlshare.me</span>}
      </Link>
    );
  }

  return (
    <>
      <RiLink size={iconSize} />
      {withName && <span className="font-extralight">urlshare.me</span>}
    </>
  );
};
