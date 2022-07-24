import { FC } from "react";

interface LoadingIndicatorProps {
  title: string;
  size?: number;
}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ title, size = 40 }) => {
  return <img src="/loader.svg" alt={title} width={size} height={size} />;
};
