import { Heart } from "lucide-react";
import { FC, useState } from "react";
import { api } from "../../../../utils/api";
import { LoadingIndicator } from "../../../core/ui/loading-indicator";
import { Feed } from "@prisma/client";

type ToggleLikeUrlProps = {
  feedId: Feed["id"];
  liked: boolean;
  likes: number;
};

export const ToggleLikeUrl: FC<ToggleLikeUrlProps> = ({ feedId, liked, likes }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [likesNumber, setLikesNumber] = useState(likes);

  const { mutate: toggle, isLoading: isToggling } = api.feed.toggleLikeUrl.useMutation({
    onSuccess(result) {
      if (result.status === "notFound") {
        // TODO: Remove not found feed entry by its ID, perhaps also notify via toast.
      } else {
        setLikesNumber(result.likes);
        setIsLiked(result.status === "liked");
      }
    },
  });

  return (
    <button
      className="flex items-center gap-1.5 rounded-xl p-2 text-sm hover:bg-red-50"
      onClick={() => toggle({ feedId })}
    >
      {isLiked ? (
        isToggling ? (
          <LoadingIndicator label="Unliking..." size={14} />
        ) : (
          <Heart fill="#dc2626" color="#dc2626" size={18} strokeWidth={1} />
        )
      ) : isToggling ? (
        <LoadingIndicator label="Liking..." size={14} />
      ) : (
        <Heart size={18} strokeWidth={1} />
      )}
      {likesNumber}
    </button>
  );
};
