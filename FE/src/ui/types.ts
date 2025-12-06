const TVariant = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  OUTLINE: "ounline",
} as const;

type TVariantKeys = (typeof TVariant)[keyof typeof TVariant];

const TButtonVariant = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SPECIAL: "special",
  DANGER: "danger",
} as const;

type TButtonVariantKeys = (typeof TButtonVariant)[keyof typeof TButtonVariant];

const TButtonSize = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
} as const;

type TButtonSizeKeys = (typeof TButtonSize)[keyof typeof TButtonSize];

export {
  TVariant,
  type TVariantKeys,
  TButtonVariant,
  type TButtonVariantKeys,
  TButtonSize,
  type TButtonSizeKeys,
};

export type EditProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
};
