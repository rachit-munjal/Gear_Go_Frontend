import { useEffect, useState } from "react";
import Layout from "../layout";
import { userBookings } from "../../../utils/services/user";
import { useAuth } from "../../../context/context";
import Loading from "../../../components/loading";

const Bookings = () => {
    const { user, loading } = useAuth();

    const [bookings, setBookings] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            const data = await userBookings(user._id);

            // console.log("Data", data.bookings);

            if (data.ok) setBookings(data.bookings);
        };

        if (!loading) fetchBookings();
    }, []);

    if (loading || !bookings) return <Loading />;

    return (
        <div>
            <Layout title="Bookings" data={bookings} />
        </div>
    );
};

export default Bookings;
