import { FC } from "react";
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  label: string;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ label }) => {
  return <Loader2 className="cursor-progress animate-spin" aria-label={label} />;
};
