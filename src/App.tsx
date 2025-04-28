import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";

import Home from "./pages/Home";
import PopularStations from "./pages/PopularStations";
import CountriesPage from "./pages/CountriesPage";
import GenresPage from "./pages/GenresPage";
import LanguagesPage from "./pages/LanguagesPage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SuggestRadioPage from "./pages/SuggestRadioPage";
import HistoryPage from "./pages/HistoryPage";
import AdvertisingPage from "./pages/AdvertisingPage";
import StationDetailsPage from "./pages/StationDetailsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AudioPlayerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/popular" element={<PopularStations />} />
                <Route path="/countries" element={<CountriesPage />} />
                <Route path="/genres" element={<GenresPage />} />
                <Route path="/languages" element={<LanguagesPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/suggest-radio" element={<SuggestRadioPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/advertising" element={<AdvertisingPage />} />
                
                <Route path="/station/:slug" element={<StationDetailsPage />} />
                
                {/* Redirections pour les URL en français */}
                <Route path="/pays" element={<Navigate to="/countries" replace />} />
                <Route path="/populaires" element={<Navigate to="/popular" replace />} />
                <Route path="/genres" element={<GenresPage />} />
                <Route path="/langues" element={<Navigate to="/languages" replace />} />
                <Route path="/recherche" element={<Navigate to="/search" replace />} />
                <Route path="/favoris" element={<Navigate to="/favorites" replace />} />
                <Route path="/a-propos" element={<Navigate to="/about" replace />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/suggerer-radio" element={<Navigate to="/suggest-radio" replace />} />
                <Route path="/historique" element={<Navigate to="/history" replace />} />
                <Route path="/publicite" element={<Navigate to="/advertising" replace />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AudioPlayerProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
