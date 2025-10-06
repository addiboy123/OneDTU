import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HostelCart from "./pages/Hostelcart";
import Profile from "./pages/Profile";
import SocietyConnect from "./pages/Societyconnect";
<<<<<<< HEAD
import Society from "./pages/Society";
=======
import FindMySpace from "./pages/FindMySpacePage";
>>>>>>> 7e598cd (findMySpace integration complete)
import './index.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hostelcart" element={<HostelCart />} />
        <Route path="/societyconnect" element={<SocietyConnect />} />
<<<<<<< HEAD
        <Route path="/societyconnect/:name" element={<Society />} />
=======
        <Route path="/findmyspace" element={<FindMySpace />} />
>>>>>>> 7e598cd (findMySpace integration complete)
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
