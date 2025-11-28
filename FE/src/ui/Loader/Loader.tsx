import type { FC } from "react";
import "./styles.scss";

const LVariant = {
  SPINNER: "spinner",
  GRADIENT: "gradient",
  DOTS: "dots",
  PULSE: "pulse",
} as const;

const LSize = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

type LoaderVariantKeys = (typeof LVariant)[keyof typeof LVariant];
type LoaderSizeKeys = (typeof LSize)[keyof typeof LSize];

interface ILoaderProps {
  variant?: LoaderVariantKeys;
  size?: LoaderSizeKeys;
  className?: string;
}

const Loader: FC<ILoaderProps> = ({
  variant = LVariant.SPINNER,
  size = LSize.MD,
  className = "",
}) => {
  return (
    <div className={`loader loader--${variant} loader--${size} ${className}`}>
      {variant === LVariant.SPINNER && (
        <div className="loader__spinner">
          <div className="loader__spinner-ring"></div>
        </div>
      )}

      {variant === LVariant.GRADIENT && (
        <div className="loader__gradient">
          <div className="loader__gradient-ring"></div>
        </div>
      )}

      {variant === LVariant.DOTS && (
        <div className="loader__dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {variant === LVariant.PULSE && (
        <div className="loader__pulse">
          <div className="loader__pulse-circle"></div>
        </div>
      )}
    </div>
  );
};

export default Loader;
export { LVariant, LSize };
export type { LoaderVariantKeys, LoaderSizeKeys };
