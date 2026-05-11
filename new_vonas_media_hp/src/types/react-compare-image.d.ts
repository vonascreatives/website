declare module "react-compare-image" {
  import { CSSProperties, ComponentType } from "react";

  export interface ReactCompareImageProps {
    leftImage: string;
    rightImage: string;
    leftImageAlt?: string;
    rightImageAlt?: string;
    leftImageCss?: CSSProperties;
    rightImageCss?: CSSProperties;
    leftImageLabel?: string;
    rightImageLabel?: string;
    sliderLineColor?: string;
    sliderLineWidth?: number;
    handle?: React.ReactNode;
    handleSize?: number;
    hover?: boolean;
    aspectRatio?: "taller" | "wider";
    vertical?: boolean;
    skeleton?: React.ReactNode;
    onSliderPositionChange?: (position: number) => void;
    sliderPositionPercentage?: number;
  }

  const ReactCompareImage: ComponentType<ReactCompareImageProps>;
  export default ReactCompareImage;
}
