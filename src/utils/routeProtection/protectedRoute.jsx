import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { useEffect } from "react";
import Loading from "../../components/loading";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/");
            }
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <Loading />;
    }

    if (!user && !loading) {
        return null;
    }

    if (user) return children;

    return null;
};

export default ProtectedRoute;
