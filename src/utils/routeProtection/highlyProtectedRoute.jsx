import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { useEffect } from "react";
import Loading from "../../components/loading";

const HighlyProtectedRoute = ({ children }) => {
    const { user, admin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user && !admin) {
                navigate("/");
            }
        }
    }, [user, admin, loading, navigate]);

    if (loading) {
        return <Loading />;
    }

    if (!user && !admin) {
        return null;
    }

    if (admin) {
        return children;
    }

    return null;
};

export default HighlyProtectedRoute;
