// import Home from "./pages/home";
import { PreferencesProvider } from "@/components/contexts/preferences-context";
import HomePage from "@/components/home-page.ext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <HomePage />
      </PreferencesProvider>
    </QueryClientProvider>
  );
}

export default App;
