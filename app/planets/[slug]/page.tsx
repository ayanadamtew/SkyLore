import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObjectStoryPage } from "@/components/product/ObjectStoryPage";
import { PLANETS, planetBySlug } from "@/data/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PLANETS.map((planet) => ({ slug: planet.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const planet = planetBySlug((await params).slug);
  if (!planet) return {};
  const title = `${planet.name}, a wandering world`;
  const description = planet.story;
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

export default async function PlanetPage({ params }: PageProps) {
  const planet = planetBySlug((await params).slug);
  if (!planet) notFound();
  return (
    <ObjectStoryPage
      name={planet.name}
      kind="Planet"
      subtitle="A wandering world in the local sky."
      story={planet.story}
      accent={planet.color}
      facts={[["Object class", "Solar System planet"], ["Position", "Calculated for your observer"], ["Light", "Reflected sunlight"], ["Motion", "Changes nightly"]]}
    />
  );
}
