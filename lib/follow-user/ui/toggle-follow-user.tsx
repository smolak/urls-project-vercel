import { User } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { LoadingIndicator } from "../../core/ui/loading-indicator";
import { api } from "../../../utils/api";

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
      {(!isDoneChecking || isToggling) && <LoadingIndicator label="Checking follow status" />}
      {isDoneChecking && !isToggling && (
        <button
          onClick={() => toggle({ userId })}
          disabled={isToggling}
          className="flex items-center inline-block rounded-lg bg-indigo-600 px-2 py-1 text-base font-semibold
          text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700 gap-1"
        >
          {isFollowing ? (
            <>
              <span>Unfollow</span>
              <RiUserFollowLine className="text-indigo-200" aria-hidden="true" />
            </>
          ) : (
            <>
              <span>Follow</span>
              <RiUserUnfollowLine display="inline" className="text-indigo-200" aria-hidden="true" />
            </>
          )}
        </button>
      )}
    </div>
  );
};
