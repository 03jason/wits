import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import des pages
import Home from "./siteWits/pages/home";
import AboutUs from "./siteWits/pages/aboutUs";
import Login from "./siteWits/pages/login";
import Products from "./siteWits/pages/products";
import AddProduct from "./siteWits/pages/addProduct";
import EditProduct from "./siteWits/pages/editProduct";
import Movements from "./siteWits/pages/movements";
import Header from "./siteWits/pages/header"; // ton futur composant commun

export default function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/products/edit/:id" element={<EditProduct />} />
                <Route path="/movements" element={<Movements />} />
                <Route path="/about" element={<AboutUs />} />
            </Routes>
        </Router>
    );
}
