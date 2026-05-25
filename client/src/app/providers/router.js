import { Route, Routes } from "react-router-dom";
import { HomePage } from "../../pages/home/ui/HomePage";
import { AboutPage } from "../../pages/about/ui/AboutPage";
import { MyRoutesPage } from "../../pages/my-routes/ui/MyRoutesPage";
import { PlaceDetailsPage } from "../../pages/place-details/ui/PlaceDetailsPage";
import { PointsPage } from "../../pages/points/ui/PointsPage";
import { PrivacyPolicyPage } from "../../pages/privacy-policy/ui/PrivacyPolicyPage";
import { ProfileAuthPage } from "../../pages/profile-auth/ui/ProfileAuthPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RouteDetailsPage } from "../../pages/route-details/ui/RouteDetailsPage";
import { SearchRoutesPage } from "../../pages/search-routes/ui/SearchRoutesPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/my-routes"
        element={
          <ProtectedRoute>
            <MyRoutesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/profile" element={<ProfileAuthPage />} />
      <Route path="/search" element={<SearchRoutesPage />} />
      <Route path="/places" element={<PointsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/place" element={<PlaceDetailsPage />} />
      <Route path="/place/:documentId" element={<PlaceDetailsPage />} />
      <Route path="/route" element={<RouteDetailsPage />} />
      <Route path="/route/:documentId" element={<RouteDetailsPage />} />
    </Routes>
  );
}
