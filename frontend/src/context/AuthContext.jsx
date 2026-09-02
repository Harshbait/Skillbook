/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";

const AuthContext = createContext(null);

function buildUser(decoded, profile) {
    return {
        userId: decoded.userId,
        role: profile?.role || decoded.role,
        name: profile?.name,
        email: profile?.email,
        _id: profile?._id || decoded.userId,
    };
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    const loadSession = useCallback(async (currentToken) => {
        if (!currentToken) {
            setUser(null);
            setReady(true);
            return;
        }

        try {
            const decoded = jwtDecode(currentToken);
            setUser(buildUser(decoded));

            try {
                const { data } = await API.get("/users/profile");
                setUser(buildUser(decoded, data.user));
            } catch (profileError) {
                if (profileError.response?.status === 401) {
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }
            }
        } catch {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        } finally {
            setReady(true);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadSession(token);
    }, [token, loadSession]);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setReady(false);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setReady(true);
    };

    const refreshProfile = async () => {
        if (!token) return;
        await loadSession(token);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                refreshProfile,
                ready,
                isAuthenticated: Boolean(token),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
