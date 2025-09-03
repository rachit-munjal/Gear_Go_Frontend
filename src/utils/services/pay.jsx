import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL_EWS} from "../constants";
import Loading from "../../components/loading";
import { createBooking } from "../booking";

const PaymentButton = ({ amount, type, user, owner, endDate, carId }) => {
    const [loading, setLoading] = useState(false);
    const [userDetails, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // console.log("User: ", user);
        // console.log("Owner: ", owner);
        // console.log("EndDate: ", endDate);

        const fetchData = async () => {
            const response = await fetch(`${API_URL_EWS}/api/auth/${user}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("eWauthToken")}`,
                },
            });

            const data = await response.json();

            if (data.error) {
                console.error(data.error);
            } else {
                setUser(data.user);
            }
        };

        fetchData();
    }, [user]);

    if (!userDetails) {
        return <Loading />;
    }

    const handlePayment = async () => {
        try {
            setLoading(true);

            // console.log("User Details: ", userDetails);

            const amountToPay = Number(amount.toFixed(0)) * 100;

            // console.log("Amount to pay: ", amountToPay);

            if (amountToPay <= 0) {
                alert("Invalid amount to pay");
                return;
            }

            // console.log("Amount to pay: ", amountToPay);

            const res = await fetch(`${API_URL_EWS}/api/payment/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("eWauthToken")}`,
                },
                body: JSON.stringify({ amount: amountToPay }),
            });

            const { order } = await res.json();

            if (res.ok) {
            } else {
                throw new Error("Failed to create payment order");
            }

            const booking = await createBooking({
                buyer: userDetails._id,
                seller: owner,
                bookType: type,
                bookingEndDate: type === "Rent" ? endDate : null,
                car: carId,
                pricePaid: amount,
            });

            if (booking.error) {
                throw new Error("Failed to create booking");
            }

            if (booking.ok) {
                alert("Booking created successfully");

                if (type === "Buy") navigate("/profile/bookings");

                if (type === "Rent") navigate("/profile/rentals");
            }

            // const options = {
            //     key: RAZORPAY_KEY_ID,
            //     amount: order.amount,
            //     currency: order.currency,
            //     name: "Expo Wheels",
            //     description: `Payment for ${type} Services`,
            //     image: "/EXPOWHEELS.png",
            //     order_id: order.id,
            //     handler: async (response) => {
            //         console.log("Payment successful:", response);
            //         alert(
            //             "Payment successful! Payment ID: " +
            //                 response.razorpay_payment_id
            //         );

            //         await createBooking({
            //             buyer: userDetails._id,
            //             owner,
            //             bookType: type,
            //             endDate,
            //         });
            //     },
            //     prefill: {
            //         name: userDetails.name,
            //         email: userDetails.email,
            //     },
            //     theme: {
            //         color: "#3399cc",
            //     },
            // };

            // const rzp = new window.Razorpay(options);
            // rzp.open();
        } catch (error) {
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="w-full rounded-md text-center border p-4 font-bold bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            onClick={handlePayment}
            disabled={loading}
        >
            {loading ? "Processing..." : "Pay Now"}
        </button>
    );
};

export default PaymentButton;
