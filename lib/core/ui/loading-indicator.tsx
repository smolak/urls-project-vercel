import { FC } from "react";

interface LoadingIndicatorProps {
  title: string;
  size?: number;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ title }) => {
  return <div className="btn btn-sm btn-ghost loading cursor-progress" title={title} />;
};
