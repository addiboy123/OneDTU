import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HostelCart from "./pages/Hostelcart";
import Profile from "./pages/Profile";
import SocietyConnect from "./pages/Societyconnect";
import Society from "./pages/Society";
import FindMySpace from "./pages/FindMySpacePage";
import DtuNav from "./pages/DtuNav";

import './index.css'; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    // ✅ Wrap everything inside QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/hostelcart" element={<HostelCart />} />
          <Route path="/societyconnect" element={<SocietyConnect />} />
          <Route path="/societyconnect/:name" element={<Society />} />
          <Route path="/findmyspace" element={<FindMySpace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dtunavigate" element={<DtuNav />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
