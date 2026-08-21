import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ListingDetails from "./pages/ListingDetails";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import MyTrips from "./pages/MyTrips";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";



function App() {
  const [count, setCount] = useState(0);

  return (
    <>

        <div className="flex flex-col min-h-screen bg-[#E0F2FE]">
          <Navbar />

          {/* 2. flex-grow takes up all empty space, pushing the footer down */}
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings/new" element={<CreateListing />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/listings/:id/edit" element={<EditListing />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />

            </Routes>
          </main>

          <Footer />
        </div>

    </>
  );
}

export default App;
