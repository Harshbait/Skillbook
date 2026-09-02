import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";
import { dashboardPath } from "../utils/constants";

function ProtectedRoute({ roles }) {
    const { isAuthenticated, user, ready } = useAuth();

    if (!ready) {
        return <Loading label="Checking your session..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && user?.role && !roles.includes(user.role)) {
        return <Navigate to={dashboardPath(user.role)} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
