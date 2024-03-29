import Link from "next/link";
import { FC, RefAttributes } from "react";
import { Link2, LucideProps } from "lucide-react";
import { cn } from "../../utils";

type LogoProps = {
  withName?: boolean;
  asLink?: boolean;
};

type LogoContentProps = Pick<LogoProps, "withName">;

export const LogoIcon = ({ className, ...rest }: LucideProps & RefAttributes<SVGSVGElement>) => (
  <Link2 {...rest} className={cn(className, "-rotate-45")} />
);

const LogoContent = ({ withName }: LogoContentProps) => {
  return (
    <>
      <LogoIcon strokeWidth={2.25} size={25} />
      {withName && <span className="hidden font-bold sm:inline-block">urlshare.me</span>}
    </>
  );
};

export const Logo: FC<LogoProps> = ({ withName = false, asLink = true }) => {
  if (asLink) {
    return (
      <Link href="/" className="flex items-center space-x-2">
        <LogoContent withName={withName} />
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <LogoContent withName={withName} />
    </div>
  );
};
