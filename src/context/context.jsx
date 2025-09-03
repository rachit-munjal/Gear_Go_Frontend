import { createContext, useContext, useEffect, useState } from "react";
import { verifyToken } from "../utils/auth";
import { SECRET_KEY } from "../utils/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const checkUser = async () => {
            try {
                const token = localStorage.getItem("eWauthToken");

                if (!token) {
                    setUser(null);
                    setAdmin(null);
                    setLoading(false);
                    return;
                }

                const response = await verifyToken(token);

                if (response.ok) {
                    setUser(response);

                    if (response.role === SECRET_KEY) {
                        setAdmin(response);
                    } else {
                        setAdmin(null);
                    }
                } else {
                    setUser(null);
                    setAdmin(null);
                }
            } catch (err) {
                setUser(null);
                setAdmin(null);
            } finally {
                setLoading(false); // Ensure loading state is turned off once done
            }
        };

        checkUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, admin, loading, setUser, setAdmin }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
