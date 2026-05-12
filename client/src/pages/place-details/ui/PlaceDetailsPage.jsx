import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlaceDetails } from "../../../shared/api/placeDetailsApi";
import { PlaceContentSection } from "../../../widgets/place-content/ui/PlaceContentSection";
import { PlaceHeroSection } from "../../../widgets/place-hero/ui/PlaceHeroSection";
import { ReviewsMosaicSection } from "../../../widgets/reviews-mosaic/ui/ReviewsMosaicSection";

const fallbackPlace = {
  title: "Точка маршрута",
  shortDescription: "Краткое описание точки отсутствует.",
  bodyBlocks: [],
  images: [],
  heroImage: "/images/datsan.png",
  searchTag: "",
};

export function PlaceDetailsPage() {
  const { documentId } = useParams();
  const [placeDetails, setPlaceDetails] = useState(fallbackPlace);

  useEffect(() => {
    let mounted = true;
    async function loadPlace() {
      try {
        const details = await fetchPlaceDetails(documentId);
        if (!mounted) return;
        setPlaceDetails(details);
      } catch {
        if (!mounted) return;
        setPlaceDetails(fallbackPlace);
      }
    }
    loadPlace();
    return () => {
      mounted = false;
    };
  }, [documentId]);

  const galleryCards = placeDetails.images.map((image) => ({
    id: image.id,
    image: image.src,
    imageAlt: image.text || image.title || "Галерея точки",
    title: image.title || "Caption",
    description: image.text || "alt",
  }));

  return (
    <>
      <PlaceHeroSection
        title={placeDetails.title}
        shortDescription={placeDetails.shortDescription}
        heroImage={placeDetails.heroImage}
      />
      <PlaceContentSection bodyBlocks={placeDetails.bodyBlocks} searchTag={placeDetails.searchTag} />
      <ReviewsMosaicSection title="Галерея" cards={galleryCards} variant="gallery" />
    </>
  );
}


  
