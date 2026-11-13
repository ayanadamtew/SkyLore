import type { Metadata } from "next";
import { RouteHeader } from "@/components/product/RouteHeader";
import { StoryStudio } from "@/components/product/StoryStudio";

export const metadata: Metadata = {
  title: "Story Studio",
  description: "An internal editorial instrument for grounded celestial stories.",
  robots: { index: false, follow: false },
  openGraph: { title: "Story Studio | SkyLore", description: "An internal editorial instrument for grounded celestial stories.", images: [] },
  twitter: { title: "Story Studio | SkyLore", description: "An internal editorial instrument for grounded celestial stories.", images: [] },
};

export default function StudioPage() {
  return <main className="route-page"><RouteHeader /><StoryStudio /></main>;
}
