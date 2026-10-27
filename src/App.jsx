import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "../src/App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Recommendation from "./pages/Recommendation";
import Wishlist from "./pages/Wishlist";
import Settings from "./pages/Settings";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Books from "./pages/Books";
import Products from "./pages/Products";

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="app">
     {/* <LoadingScreen/> */}
      {!isAdminPage && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="/books" element={<Books />} />
          <Route path="/products" element={<Products />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  );
}

