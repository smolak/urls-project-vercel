import { FC } from "react";
import { FeedVM } from "../../models/feed.vm";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Calendar, Image as ImageIcon } from "lucide-react";
import { isImage, isWebsite } from "../../../metadata/urils";
import { LogoIcon } from "../../../shared/ui/logo";

export const UserFeedListItem: FC<FeedVM> = ({ user, url, createdAt }) => {
  const isAnImage = isImage(url.metadata);
  const isAWebsite = isWebsite(url.metadata);
  const isSomethingElse = !isAnImage && !isAWebsite;

  return (
    <Card className="overflow-hidden shadow hover:bg-slate-50">
      <CardHeader className="group gap-2 cursor-pointer">
        <CardTitle className="flex gap-3 items-center">
          {isAnImage && <ImageIcon strokeWidth={1} size={40} className="text-slate-400" aria-label="Image icon" />}
          {isAWebsite && (
            <Avatar className="w-9 h-9">
              <AvatarImage src={url.metadata.icon} />
              <AvatarFallback />
            </Avatar>
          )}
          {isSomethingElse && (
            <LogoIcon strokeWidth={1} size={40} className="text-slate-400" aria-label="Urlshare.me logo icon" />
          )}
          <a
            href={url.url}
            title={url.metadata.title}
            target="_blank"
            className="group-hover:underline decoration-slate-200 leading-7"
          >
            {url.metadata.title || url.url}
          </a>
        </CardTitle>
        <span className="text-secondary text-xs pl-12 flex flex-row items-center gap-2">
          <Calendar size={13} />
          <span>{createdAt.toLocaleString()}</span>
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {url.metadata.image && (
          <figure>
            <a href={url.url} title={url.metadata.title} target="_blank" className="flex place-content-center">
              <img src={url.metadata.image} alt={url.metadata.title} />
            </a>
          </figure>
        )}
        <CardDescription>{url.metadata.description}</CardDescription>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href={`/${user.username}`}>
          <Avatar className="hover:outline hover:outline-slate-400 outline-1 border-2 border-white h-11 w-11">
            <AvatarImage src={user.image as string} alt={user.username} />
          </Avatar>
        </Link>
      </CardFooter>
    </Card>
  );
};
