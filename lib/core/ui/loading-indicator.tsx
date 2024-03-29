import { FC } from "react";
import { Loader2, LucideProps } from "lucide-react";

interface LoadingIndicatorProps {
  label: string;
  size?: LucideProps["size"];
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ label, size }) => {
  return <Loader2 className="animate-spin cursor-progress" aria-label={label} size={size} />;
};
