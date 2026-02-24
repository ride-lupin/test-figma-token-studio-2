import figma from "@figma/code-connect";
import { Button } from "./Button";

figma.connect(
  Button,
  "https://www.figma.com/design/JDHC74vI5CLHmjFhtRt8bp/Ride-Design-System?node-id=3119-14779",
  {
    props: {
      variants: figma.enum("Type", {
        Fill: "solid",
        Border: "border",
        "Light Solid": "lightSolid",
      }),
      color: figma.enum("Color", {
        Primary: "primary",
        Neutral: "gray",
        Negative: "red",
        Warning: "yellow",
        Positive: "green",
      }),
      size: figma.enum("Size", {
        "56": 56,
        "48": 48,
        "40": 40,
        "32": 32,
        "28": 28,
      }),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      children: figma.string("Text"),
    },
    example: ({ variants, color, size, disabled, children }) => (
      <Button variants={variants} color={color} size={size} disabled={disabled}>
        {children}
      </Button>
    ),
  }
);
