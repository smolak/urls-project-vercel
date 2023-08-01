import { Badge } from "../../components/ui/badge";
import { FC } from "react";
import { cn } from "../../utils";

type FollowingBadgeProps = {
  className?: string;
};

export const FollowingBadge: FC<FollowingBadgeProps> = ({ className }) => (
  <Badge className={cn("py-0 font-normal", className)} variant="secondary">
    Following
  </Badge>
);
