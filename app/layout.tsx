import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Providers } from "@/components/providers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "SkyLore",
      template: "%s | SkyLore",
    },
    description: "Explore your sky tonight, one verified astronomical story at a time.",
    openGraph: {
      title: "SkyLore",
      description: "Look up. Know what you see.",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "SkyLore live celestial observatory" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "SkyLore",
      description: "Look up. Know what you see.",
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05080d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
