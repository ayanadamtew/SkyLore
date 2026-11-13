import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObjectStoryPage } from "@/components/product/ObjectStoryPage";
import { CONSTELLATIONS, constellationBySlug } from "@/data/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CONSTELLATIONS.map((constellation) => ({ slug: constellation.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const constellation = constellationBySlug((await params).slug);
  if (!constellation) return {};
  const title = `${constellation.name}, ${constellation.subtitle}`;
  return {
    title,
    description: constellation.story,
    openGraph: { title, description: constellation.story, images: [] },
    twitter: { title, description: constellation.story, images: [] },
  };
}

export default async function ConstellationPage({ params }: PageProps) {
  const constellation = constellationBySlug((await params).slug);
  if (!constellation) notFound();
  return (
    <ObjectStoryPage
      name={constellation.name}
      kind="Constellation"
      subtitle={constellation.subtitle}
      story={constellation.story}
      accent={constellation.color}
      facts={[["Pattern", constellation.subtitle], ["Catalog stars", String(constellation.stars.length)], ["Nature", "Line-of-sight pattern"], ["Visibility", "Observer dependent"]]}
    />
  );
}
