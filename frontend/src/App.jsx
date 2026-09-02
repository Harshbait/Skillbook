import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Dashboard from "./pages/Dashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderApply from "./pages/ProviderApply";
import AddService from "./pages/AddService";
import MyServices from "./pages/MyServices";
import EditService from "./pages/EditService";

function App() {
    return (
        <BrowserRouter>
            <SmoothScroll>
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
                >
                    Skip to content
                </a>

                <div className="flex min-h-screen flex-col">
                    <Navbar />

                    <main id="main" className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/services/:id" element={<ServiceDetails />} />
                            <Route path="/become-provider" element={<ProviderApply />} />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                            </Route>

                            <Route element={<ProtectedRoute roles={["provider"]} />}>
                                <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                                <Route path="/add-service" element={<AddService />} />
                                <Route path="/my-services" element={<MyServices />} />
                                <Route path="/my-services/:id/edit" element={<EditService />} />
                            </Route>

                            <Route element={<ProtectedRoute roles={["admin"]} />}>
                                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </SmoothScroll>
        </BrowserRouter>
    );
}

export default App;
