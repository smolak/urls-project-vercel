import { FC } from "react";
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  label: string;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ label }) => {
  return <Loader2 className="animate-spin cursor-progress" aria-label={label} />;
};
