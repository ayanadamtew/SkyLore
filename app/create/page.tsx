import type { Metadata } from "next";
import { DrawSkyExperience } from "@/components/product/DrawSkyExperience";

export const metadata: Metadata = {
  title: "Draw Your Sky",
  description: "Connect real visible stars and create a personal constellation in your sky.",
  openGraph: { title: "Draw Your Sky | SkyLore", description: "Create a personal constellation from real stars.", images: [] },
  twitter: { title: "Draw Your Sky | SkyLore", description: "Create a personal constellation from real stars.", images: [] },
};

export default function CreatePage() {
  return <DrawSkyExperience />;
}
