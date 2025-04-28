
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext"
import App from './App.tsx'
import './index.css'

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AudioPlayerProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </AudioPlayerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
