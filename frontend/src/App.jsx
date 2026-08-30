import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Dashboard from "./pages/Dashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderApply from "./pages/ProviderApply";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Public */}
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/services"
                    element={<Services />}
                />

                <Route
                    path="/services/:id"
                    element={<ServiceDetails />}
                />


                {/* Protected */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/provider-dashboard"
                        element={<ProviderDashboard />}
                    />

                    <Route
                        path="/admin-dashboard"
                        element={<AdminDashboard />}
                    />

                </Route>
                
                <Route
                    path="/become-provider"
                    element={<ProviderApply />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;