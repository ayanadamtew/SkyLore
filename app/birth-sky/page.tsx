import type { Metadata } from "next";
import { BirthSkyExperience } from "@/components/product/BirthSkyExperience";

export const metadata: Metadata = {
  title: "Your Birth Sky",
  description: "Reconstruct the sky above a place at one exact moment.",
  openGraph: { title: "Your Birth Sky | SkyLore", description: "Reconstruct the sky above a place at one exact moment.", images: [] },
  twitter: { title: "Your Birth Sky | SkyLore", description: "Reconstruct the sky above a place at one exact moment.", images: [] },
};

export default function BirthSkyPage() {
  return <BirthSkyExperience />;
}
