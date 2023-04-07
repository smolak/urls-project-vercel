import { FC } from "react";

interface LoadingIndicatorProps {
  title: string;
  size?: number;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ title }) => {
  return <div className="btn btn-lg btn-ghost loading" title={title} />;
};
