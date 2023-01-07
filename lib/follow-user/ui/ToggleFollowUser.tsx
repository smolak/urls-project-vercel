import { User } from "@prisma/client";
import { FC } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { useToggleFollowUser } from "../hooks/useToggleFollowUser";
import { useIsFollowingUser } from "../hooks/useIsFollowingUser";
import { LoadingIndicator } from "../../core/ui/LoadingIndicator";

interface ToggleFollowUserProps {
  userId: User["id"];
}

export const ToggleFollowUser: FC<ToggleFollowUserProps> = ({ userId }) => {
  const { data, isLoading: isChecking, isSuccess: isDoneChecking } = useIsFollowingUser({ userId });
  const { mutate: toggle, isLoading: isToggling } = useToggleFollowUser();

  return (
    <div>
      {isChecking && <LoadingIndicator title="Checking follow status" />}
      {isDoneChecking && (
        <button
          onClick={() => toggle({ userId })}
          disabled={isToggling}
          className="flex items-center inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
        >
          {data.isFollowing ? (
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
