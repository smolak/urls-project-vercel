import { FC } from "react";
import { LoadingIndicator } from "../../core/ui/loading-indicator";

export const LoadingUserFeed: FC = () => {
  return (
    <div className="flex justify-center p-20">
      <LoadingIndicator title="Loading user feeds..." />
    </div>
  );
};
