import { Badge } from "../../components/ui/badge";
import { FC } from "react";
import { cn } from "../../utils";

type FollowsMeBadgeProps = {
  className?: string;
};

export const FollowsMeBadge: FC<FollowsMeBadgeProps> = ({ className }) => (
  <Badge className={cn("py-0 font-normal", className)} variant="secondary">
    Follows me
  </Badge>
);
