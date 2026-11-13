import type { Metadata } from "next";
import { SkyExplorer } from "@/components/product/SkyExplorer";
import { cityBySlug } from "@/data/catalog";

type PageProps = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = cityBySlug(slug);
  const title = `Tonight's sky above ${city.name}`;
  const description = `Explore the verified stars, planets, and constellations visible from ${city.name}.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

export default async function CitySkyPage({ params }: PageProps) {
  const { city } = await params;
  return <SkyExplorer initialCitySlug={city} />;
}
