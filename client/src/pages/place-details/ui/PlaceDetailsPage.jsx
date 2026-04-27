import { PlaceContentSection } from "../../../widgets/place-content/ui/PlaceContentSection";
import { PlaceHeroSection } from "../../../widgets/place-hero/ui/PlaceHeroSection";
import { ReviewsMosaicSection } from "../../../widgets/reviews-mosaic/ui/ReviewsMosaicSection";

export function PlaceDetailsPage() {
  return (
    <>
      <PlaceHeroSection />
      <PlaceContentSection />
      <ReviewsMosaicSection />
    </>
  );
}
