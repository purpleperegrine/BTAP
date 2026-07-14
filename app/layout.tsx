import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: "Barley’s Taproom & Pizzeria | Spindale, NC",
    description:
      "Pizza, rotating taps, and live music in downtown Spindale. View the food menu, beer menu, upcoming shows, hours, and location.",
    applicationName: "Barley’s Taproom & Pizzeria",
    icons: {
      icon: "/barleys-logo.png",
      shortcut: "/barleys-logo.png",
    },
    openGraph: {
      type: "website",
      url: metadataBase,
      siteName: "Barley’s Taproom & Pizzeria",
      title: "Pizza, pints & a good night out.",
      description:
        "Food, rotating taps, and live music in downtown Spindale, North Carolina.",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "Barley’s Taproom & Pizzeria — pizza, pints, and live music in Spindale, North Carolina",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Barley’s Taproom & Pizzeria",
      description: "Pizza, pints, and live music in downtown Spindale.",
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#17110f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
