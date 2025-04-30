
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "./components/Layout";

import Home from "./pages/Home";
import PopularStations from "./pages/PopularStations";
import CountriesPage from "./pages/CountriesPage";
import GenresPage from "./pages/GenresPage";
import LanguagesPage from "./pages/LanguagesPage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SuggestRadioPage from "./pages/SuggestRadioPage";
import PendingRadiosPage from "./pages/PendingRadiosPage";
import HistoryPage from "./pages/HistoryPage";
import AdvertisingPage from "./pages/AdvertisingPage";
import StationDetailsPage from "./pages/StationDetailsPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

const App = () => {
  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/popular" element={<PopularStations />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/languages" element={<LanguagesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/suggest-radio" element={<SuggestRadioPage />} />
            <Route path="/pending-radios" element={<PendingRadiosPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/advertising" element={<AdvertisingPage />} />
            
            <Route path="/station/:slug" element={<StationDetailsPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            
            {/* Redirections pour les URL en français */}
            <Route path="/actualites" element={<Navigate to="/news" replace />} />
            <Route path="/pays" element={<Navigate to="/countries" replace />} />
            <Route path="/populaires" element={<Navigate to="/popular" replace />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/langues" element={<Navigate to="/languages" replace />} />
            <Route path="/recherche" element={<Navigate to="/search" replace />} />
            <Route path="/favoris" element={<Navigate to="/favorites" replace />} />
            <Route path="/a-propos" element={<Navigate to="/about" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/suggerer-radio" element={<Navigate to="/suggest-radio" replace />} />
            <Route path="/radios-en-attente" element={<Navigate to="/pending-radios" replace />} />
            <Route path="/historique" element={<Navigate to="/history" replace />} />
            <Route path="/publicite" element={<Navigate to="/advertising" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </TooltipProvider>
    </>
  );
};

export default App;
