import  { memo } from "react";
import { DefaultTemplate } from "../Temlates/DefaultTemplate";
import { GridTemplate } from "../Temlates/GridTemplate";
import { type SectionVariant } from "@/store/builder/types"; 
interface SectionContentProps {
  variant?: SectionVariant;
  childrenIds: string[];
}

export const SectionContent = memo(({ variant, childrenIds }: SectionContentProps) => {
  switch (variant) {
  case "two-columns":
    return <GridTemplate childrenIds={childrenIds} columns={2} />;
  case "three-columns":
    return <GridTemplate childrenIds={childrenIds} columns={3} />;
  case "default":
  default:
    return <DefaultTemplate childrenIds={childrenIds} />;
  }
});

SectionContent.displayName = "SectionContent";