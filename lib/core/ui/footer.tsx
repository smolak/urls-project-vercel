import { Logo } from "../../shared/ui/logo";
import { RiGithubFill } from "react-icons/ri";

export const Footer = () => {
  return (
    <footer className="text-secondary container flex h-16 items-center justify-between border-t text-sm">
      <div className="flex items-center gap-2">
        <Logo />
        <p>Copyright © 2023 - All right reserved</p>
      </div>
      <div className="flex items-center">
        <a href="https://github.com/smolak/urls-project-vercel" target="_blank">
          <RiGithubFill size={30} className="inline" />
        </a>
      </div>
    </footer>
  );
};
