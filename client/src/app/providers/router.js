import { Route, Routes } from "react-router-dom";
import { HomePage } from "../../pages/home/ui/HomePage";
import { PlaceDetailsPage } from "../../pages/place-details/ui/PlaceDetailsPage";
import { SearchRoutesPage } from "../../pages/search-routes/ui/SearchRoutesPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchRoutesPage />} />
      <Route path="/place" element={<PlaceDetailsPage />} />
    </Routes>
  );
}
