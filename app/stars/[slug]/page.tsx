import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObjectStoryPage } from "@/components/product/ObjectStoryPage";
import { STAR_CATALOG, starBySlug } from "@/data/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return STAR_CATALOG.map((star) => ({ slug: star.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const star = starBySlug((await params).slug);
  if (!star) return {};
  const title = `${star.name}, ${star.constellation}`;
  return {
    title,
    description: star.hook,
    openGraph: { title, description: star.hook, images: [] },
    twitter: { title, description: star.hook, images: [] },
  };
}

export default async function StarPage({ params }: PageProps) {
  const star = starBySlug((await params).slug);
  if (!star) notFound();
  return (
    <ObjectStoryPage
      name={star.name}
      kind="Star"
      subtitle={star.hook}
      story={star.story}
      accent={star.color}
      facts={[["Constellation", star.constellation], ["Distance", star.distanceLabel], ["Spectral class", star.spectral], ["Apparent magnitude", star.magnitude.toFixed(2)]]}
    />
  );
}
