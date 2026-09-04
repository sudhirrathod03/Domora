import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Loader from "./components/Loader.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const ListingDetails = lazy(() => import("./pages/ListingDetails.jsx"));
const CreateListing = lazy(() => import("./pages/CreateListing.jsx"));
const EditListing = lazy(() => import("./pages/EditListing.jsx"));
const MyTrips = lazy(() => import("./pages/MyTrips.jsx"));
const Success = lazy(() => import("./pages/Success.jsx"));
const Cancel = lazy(() => import("./pages/Cancel.jsx"));

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "8px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      <div className="flex flex-col min-h-screen bg-[#E0F2FE]">
        <Navbar />

        <main className="flex-grow flex flex-col">
          <Suspense fallback={<Loader fullScreen={false} />}>
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
          </Suspense>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;