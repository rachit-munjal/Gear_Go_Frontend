import Layout from "../layout";
import { useEffect, useState } from "react";
import { userSales } from "../../../utils/services/user";
import { useAuth } from "../../../context/context";
import Loading from "../../../components/loading";

const Sales = () => {
    const { user, loading } = useAuth();

    const [sales, setSales] = useState(null);

    useEffect(() => {
        const fetchSales = async () => {
            const data = await userSales(user._id);

            console.log("Data", data.sales);

            if (data.ok) setSales(data.sales);
        };

        if (!loading) fetchSales();
    }, []);

    if (loading || !sales) return <Loading />;

    return (
        <div>
            <Layout data={sales} title="Sales" showDetails={true} />
        </div>
    );
};

export default Sales;
