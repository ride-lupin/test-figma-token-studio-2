import figma from "@figma/code-connect";
import { Button } from "./Button";

figma.connect(
  Button,
  "https://www.figma.com/design/JDHC74vI5CLHmjFhtRt8bp/Ride-Design-System?node-id=3119-14696",
  {
    props: {
      variants: figma.enum("type", {
        Fill: "solid",
        Border: "border",
        LightFill: "lightSolid",
      }),
      color: figma.enum("color", {
        Primary: "primary",
        Gray: "gray",
        Red: "red",
        Yellow: "yellow",
        Green: "green",
      }),
      size: figma.enum("size", {
        "56": 56,
        "48": 48,
        "40": 40,
        "32": 32,
        "28": 28,
      }),
      disabled: figma.enum("state", {
        Disabled: true,
      }),
      children: figma.string("text"),
    },
    example: ({ variants, color, size, disabled, children }) => (
      <Button variants={variants} color={color} size={size} disabled={disabled}>
        {children}
      </Button>
    ),
  }
);
