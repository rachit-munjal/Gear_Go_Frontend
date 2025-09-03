import { useEffect, useState } from "react";
import Card from "../../../components/landing/main/card";
import { useAuth } from "../../../context/context";
import { getUser } from "../../../utils/services/user";
import Loading from "../../../components/loading";

const AdminProfile = () => {
    const { user } = useAuth();

    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const profile = await getUser(user._id);

            // console.log("Profile", profile.user);

            setUserProfile(profile.user);
        };

        fetchUser();
    }, [user]);

    const cards = [
        {
            title: "Cars Bought",
            link: "/profile/bookings",
            image: "/cards/buy.jpg",
        },
        {
            title: "Cars Sold",
            link: "/profile/sales",
            image: "/cards/sell.jpg",
        },
        {
            title: "Cars Rented",
            link: "/profile/rentals",
            image: "/cards/rent.jpg",
        },
    ];

    if (!userProfile) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col items-center p-8 gap-16">
            <div className="flex flex-col gap-2">
                <h1
                    style={{
                        fontFamily: "SuperBrigadeTitle",
                        letterSpacing: "-0.2rem",
                    }}
                    className="text-5xl md:text-6xl text-center font-bold"
                >
                    Admin Panel
                </h1>
                <h4
                    style={{
                        fontFamily: "Poppins",
                    }}
                    className="text-center italic"
                >
                    Welcome to Admin Page of ExpoWheels.
                </h4>
                <div
                    className="flex flex-col gap-2 font-bold border-2 py-4 m-4 text-2xl italic border-solid bolder-black rounded-md items-center"
                    style={{
                        fontFamily: "Montserrat",
                    }}
                >
                    <div>Name :- {userProfile?.name}</div>
                    <div>Email :- {userProfile?.email}</div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card item={cards[0]} />
                <Card item={cards[1]} />
                <Card item={cards[2]} />
            </div>
        </div>
    );
};

export default AdminProfile;
