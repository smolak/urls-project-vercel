import { Logo } from "../../shared/ui/logo";
import { RiGithubFill } from "react-icons/ri";

export const Footer = () => {
  return (
    <footer className="footer items-center p-4 bg-neutral text-neutral-content">
      <div className="items-center grid-flow-col">
        <Logo iconSize={36} />
        <p>Copyright © 2023 - All right reserved</p>
      </div>
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="https://github.com/smolak/urls-project-vercel" target="_blank">
          <RiGithubFill className="inline" size={36} />
        </a>
      </div>
    </footer>
  );
};
