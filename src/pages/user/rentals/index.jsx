import Layout from "../layout";
import { useEffect, useState } from "react";
import { userRentals } from "../../../utils/services/user";
import { useAuth } from "../../../context/context";
import Loading from "../../../components/loading";

const Rentals = () => {
    const { user, loading } = useAuth();

    const [rentals, setRentals] = useState(null);

    useEffect(() => {
        const fetchRentals = async () => {
            const data = await userRentals(user._id);

            if (data.ok) setRentals(data.rentals);
        };

        if (!loading) fetchRentals();
    }, []);

    if (loading || !rentals) return <Loading />;

    return (
        <div>
            <Layout data={rentals} title="Rentals" />
        </div>
    );
};

export default Rentals;
