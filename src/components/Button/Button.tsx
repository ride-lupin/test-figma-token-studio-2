import { ButtonHTMLAttributes } from "react";

import {
  buttonRecipe,
  ButtonVariants,
  grayBorderTheme,
  graySolidTheme,
  greenBorderTheme,
  greenSolidTheme,
  primaryBorderTheme,
  primarySolidTheme,
  redBorderTheme,
  redSolidTheme,
  yellowBorderTheme,
  yellowSolidTheme,
} from "./button.css";

type ButtonColor = "primary" | "gray" | "red" | "yellow" | "green";

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ButtonVariants, "fullWidth"> & {
    color?: ButtonColor;
    fullWidth?: boolean;
    variants: "solid" | "lightSolid" | "border";
    size: 56 | 48 | 40 | 32 | 28;
  };

const colorThemeMap: Record<
  ButtonColor,
  Record<"solid" | "lightSolid" | "border", string>
> = {
  primary: {
    solid: primarySolidTheme,
    lightSolid: primarySolidTheme,
    border: primaryBorderTheme,
  },
  gray: {
    solid: graySolidTheme,
    lightSolid: graySolidTheme,
    border: grayBorderTheme,
  },
  red: {
    solid: redSolidTheme,
    lightSolid: redSolidTheme,
    border: redBorderTheme,
  },
  yellow: {
    solid: yellowSolidTheme,
    lightSolid: yellowSolidTheme,
    border: yellowBorderTheme,
  },
  green: {
    solid: greenSolidTheme,
    lightSolid: greenSolidTheme,
    border: greenBorderTheme,
  },
};

export function Button({
  variants = "solid",
  color = "primary",
  size = 56,
  fullWidth = false,
  className,
  children,
  ...props
}: Props) {
  const themeClass = colorThemeMap[color][variants ?? "solid"];
  const recipeClass = buttonRecipe({ variants, size, fullWidth });

  return (
    <button
      className={[themeClass, recipeClass, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
