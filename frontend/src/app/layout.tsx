import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // browser tab naming
  title: "Pokédex (Yong Sim Nie)",
  description: "A curated Pokédex powered by PokeAPI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
