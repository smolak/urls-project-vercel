import { FC } from "react";
import { LoadingIndicator } from "../../../../core/ui/loading-indicator";

export const LoadingUrls: FC = () => {
  return (
    <div className="flex justify-center p-20">
      <LoadingIndicator label="Loading urls..." />
    </div>
  );
};
