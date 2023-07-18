import { User } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { LoadingIndicator } from "../../core/ui/loading-indicator";
import { api } from "../../../utils/api";
import { Button } from "../../components/ui/button";
import { UserMinus, UserPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

interface ToggleFollowUserProps {
  userId: User["id"];
}

export const ToggleFollowUser: FC<ToggleFollowUserProps> = ({ userId }) => {
  const trpcContext = api.useContext();
  const { data: isFollowingCheck, isSuccess: isDoneChecking } = api.followUser.isFollowingUser.useQuery({ userId });
  const [isFollowing, setIsFollowing] = useState<boolean>();

  useEffect(() => {
    setIsFollowing(isFollowingCheck);
  }, [isDoneChecking, isFollowingCheck]);

  const { mutate: toggle, isLoading: isToggling } = api.followUser.toggleFollowUser.useMutation({
    onSuccess(input) {
      setIsFollowing(input.status === "following");

      return trpcContext.followUser.isFollowingUser.invalidate({ userId: input.userId });
    },
  });

  return (
    <div>
      {!isDoneChecking && <LoadingIndicator label="Checking follow status" />}
      {isDoneChecking && (
        <>
          {isFollowing ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="flex items-center gap-2"
                    variant="outline"
                    onClick={() => toggle({ userId })}
                    disabled={isToggling}
                  >
                    Following
                    {isToggling ? (
                      <LoadingIndicator size={14} label="Unfollowing..." />
                    ) : (
                      <UserMinus size={14} aria-hidden="true" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Unfollow</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button className="flex items-center gap-2" onClick={() => toggle({ userId })} disabled={isToggling}>
              Follow
              {isToggling ? (
                <LoadingIndicator size={14} label="Following..." />
              ) : (
                <UserPlus size={14} aria-hidden="true" />
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
