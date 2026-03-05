import { createTheme, style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../styles/theme.css";
import { buttonTheme } from "./buttonTheme.css";

// Color themes
export const primarySolidTheme = createTheme(buttonTheme, {
  background: vars.color.primary.default,
  border: "transparent",
  color: vars.color.primary.text,
  hover: {
    background: vars.color.primary.hover,
    border: "transparent",
    color: vars.color.primary.text,
  },
  disabled: {
    background: vars.color.primary.disabled,
    border: "transparent",
    color: vars.color.primary.textDisabled,
  },
});

export const graySolidTheme = createTheme(buttonTheme, {
  background: vars.color.gray.default,
  border: "transparent",
  color: vars.color.gray.text,
  hover: {
    background: vars.color.gray.hover,
    border: "transparent",
    color: vars.color.gray.text,
  },
  disabled: {
    background: vars.color.gray.disabled,
    border: "transparent",
    color: vars.color.gray.textDisabled,
  },
});

export const redSolidTheme = createTheme(buttonTheme, {
  background: vars.color.red.default,
  border: "transparent",
  color: vars.color.red.text,
  hover: {
    background: vars.color.red.hover,
    border: "transparent",
    color: vars.color.red.text,
  },
  disabled: {
    background: vars.color.red.disabled,
    border: "transparent",
    color: vars.color.red.textDisabled,
  },
});

export const yellowSolidTheme = createTheme(buttonTheme, {
  background: vars.color.yellow.default,
  border: "transparent",
  color: vars.color.yellow.text,
  hover: {
    background: vars.color.yellow.hover,
    border: "transparent",
    color: vars.color.yellow.text,
  },
  disabled: {
    background: vars.color.yellow.disabled,
    border: "transparent",
    color: vars.color.yellow.textDisabled,
  },
});

export const greenSolidTheme = createTheme(buttonTheme, {
  background: vars.color.green.default,
  border: "transparent",
  color: vars.color.green.text,
  hover: {
    background: vars.color.green.hover,
    border: "transparent",
    color: vars.color.green.text,
  },
  disabled: {
    background: vars.color.green.disabled,
    border: "transparent",
    color: vars.color.green.textDisabled,
  },
});

// Border variant themes
export const primaryBorderTheme = createTheme(buttonTheme, {
  background: "transparent",
  border: vars.color.primary.default,
  color: vars.color.primary.default,
  hover: {
    background: "transparent",
    border: vars.color.primary.hover,
    color: vars.color.primary.hover,
  },
  disabled: {
    background: "transparent",
    border: vars.color.primary.disabled,
    color: vars.color.primary.disabled,
  },
});

export const grayBorderTheme = createTheme(buttonTheme, {
  background: "transparent",
  border: vars.color.gray.default,
  color: vars.color.gray.default,
  hover: {
    background: "transparent",
    border: vars.color.gray.hover,
    color: vars.color.gray.hover,
  },
  disabled: {
    background: "transparent",
    border: vars.color.gray.disabled,
    color: vars.color.gray.disabled,
  },
});

export const redBorderTheme = createTheme(buttonTheme, {
  background: "transparent",
  border: vars.color.red.default,
  color: vars.color.red.default,
  hover: {
    background: "transparent",
    border: vars.color.red.hover,
    color: vars.color.red.hover,
  },
  disabled: {
    background: "transparent",
    border: vars.color.red.disabled,
    color: vars.color.red.disabled,
  },
});

export const yellowBorderTheme = createTheme(buttonTheme, {
  background: "transparent",
  border: vars.color.yellow.default,
  color: vars.color.yellow.default,
  hover: {
    background: "transparent",
    border: vars.color.yellow.hover,
    color: vars.color.yellow.hover,
  },
  disabled: {
    background: "transparent",
    border: vars.color.yellow.disabled,
    color: vars.color.yellow.disabled,
  },
});

export const greenBorderTheme = createTheme(buttonTheme, {
  background: "transparent",
  border: vars.color.green.default,
  color: vars.color.green.default,
  hover: {
    background: "transparent",
    border: vars.color.green.hover,
    color: vars.color.green.hover,
  },
  disabled: {
    background: "transparent",
    border: vars.color.green.disabled,
    color: vars.color.green.disabled,
  },
});

const baseButtonStyle = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  columnGap: "6px",
  wordBreak: "keep-all",
  cursor: "pointer",
  selectors: {
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
});

export const buttonRecipe = recipe({
  base: [
    baseButtonStyle,
    {
      background: buttonTheme.background,
      borderColor: buttonTheme.border,
      color: buttonTheme.color,
      transition:
        "background 200ms cubic-bezier(0,.65,.83,.67), color 200ms cubic-bezier(0,.65,.83,.67)",
      selectors: {
        "&:hover:not(:disabled)": {
          background: buttonTheme.hover.background,
          borderColor: buttonTheme.hover.border,
          color: buttonTheme.hover.color,
        },
        "&:disabled": {
          background: buttonTheme.disabled.background,
          borderColor: buttonTheme.disabled.border,
          color: buttonTheme.disabled.color,
        },
      },
    },
  ],
  variants: {
    variants: {
      solid: {
        border: "none",
      },
      lightSolid: {
        border: "none",
      },
      border: {
        background: "transparent",
        borderStyle: "solid",
        borderWidth: "1px",
      },
    },
    size: {
      56: {
        ...vars.typoType.button2,
        padding: "16px 24px",
        borderRadius: "14px",
      },
      48: {
        ...vars.typoType.button3,
        padding: "14px 20px",
        borderRadius: "12px",
      },
      40: {
        ...vars.typoType.button3,
        padding: "10px 16px",
        borderRadius: "10px",
      },
      32: {
        ...vars.typoType.button4,
        padding: "8px 12px",
        borderRadius: "8px",
      },
      28: {
        ...vars.typoType.button5,
        padding: "6px 10px",
        borderRadius: "7px",
      },
    },
    fullWidth: {
      true: { width: "100%" },
    },
  },
  compoundVariants: [
    {
      variants: { variants: "border", size: 56 },
      style: { padding: "15px 23px" },
    },
    {
      variants: { variants: "border", size: 48 },
      style: { padding: "13px 19px" },
    },
    {
      variants: { variants: "border", size: 40 },
      style: { padding: "9px 15px" },
    },
    {
      variants: { variants: "border", size: 32 },
      style: { padding: "7px 11px" },
    },
    {
      variants: { variants: "border", size: 28 },
      style: { padding: "5px 9px" },
    },
  ],
  defaultVariants: {
    variants: "solid",
    size: 56,
    fullWidth: false,
  },
});

export type ButtonVariants = RecipeVariants<typeof buttonRecipe>;
