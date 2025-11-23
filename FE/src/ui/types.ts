const TVariant = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
} as const;

type TVariantKeys = typeof TVariant[keyof typeof TVariant];

export {
  TVariant,
  type TVariantKeys,
};
