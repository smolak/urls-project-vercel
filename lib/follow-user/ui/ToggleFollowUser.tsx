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
        <button onClick={() => toggle({ userId })} disabled={isToggling}>
          {data.isFollowing ? <RiUserUnfollowLine /> : <RiUserFollowLine />}
        </button>
      )}
    </div>
  );
};
