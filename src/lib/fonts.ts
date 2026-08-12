import { Inter, Space_Grotesk } from "next/font/google";

export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display-family",
  display: "swap",
});

export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-family",
  display: "swap",
});

export const fontVariableClassName = `${fontDisplay.variable} ${fontBody.variable}`;
