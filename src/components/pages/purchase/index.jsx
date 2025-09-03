import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { API_URL_EWS } from "../../../utils/constants";
import { deleteSale } from "../../../utils/sales";
import { useAuth } from "../../../context/context";
import Loading from "../../loading";
import PaymentButton from "../../../utils/services/pay";

const Purchase = () => {
    const { id } = useParams();

    const [searchParams] = useSearchParams();

    const type = searchParams.get("type");

    const [carData, setCarData] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);

    const { user, loading } = useAuth();

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (!loading) {
            if (user) {
                setUserId(user._id);
            } else {
                setUserId(null);
            }
        }
    }, [user, loading]);

    const [prices, setPrices] = useState({
        originalPrice: 0,
        discountedPrice: 0,
        priceAfterDiscount: 0,
        commission: 0,
        finalPrice: 0,
        finalPriceForRent: 0,
        rentDays: 0,
    });

    const [endDate, setEndDate] = useState(() => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        const finalDate = currentDate.getTime() + 1;
        setPrices({ ...prices, rentDays: 1 });
        return finalDate;
    });

    const finalPrice = (curr) => {
        const orginalPrice = type === "Buy" ? curr.price : curr.rentPrice;

        const dicountedPrice = curr.onDiscountSale
            ? (orginalPrice * curr.onDiscountSale.discountPercentage) / 100
            : 0;

        const priceAfterDiscount = orginalPrice - dicountedPrice;

        const commission = priceAfterDiscount * 0.05;

        // console.log(priceAfterDiscount, commission);

        const finalPrice = priceAfterDiscount + commission;

        setPrices({
            ...prices,
            originalPrice: orginalPrice,
            discountedPrice: dicountedPrice,
            priceAfterDiscount,
            commission,
            finalPrice,
            finalPriceForRent: priceAfterDiscount,
        });
    };

    useEffect(() => {
        const fetchCarData = async () => {
            const response = await fetch(`${API_URL_EWS}/api/cars/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("eWauthToken")}`,
                },
            });
            const data = await response.json();
            // console.log("Data", data.data);

            setCarData(data.data);

            finalPrice(data.data);

            if (data.data.onDiscountSale?.saleDate) {
                const saleEndDate = new Date(
                    data.data.onDiscountSale.saleDate
                ).getTime();
                calculateTimeRemaining(saleEndDate);
                startTimer(saleEndDate);
            }
        };

        fetchCarData();

        return () => clearInterval(timerId);
    }, [id]);

    let timerId;

    const calculateTimeRemaining = async (saleEndDate) => {
        const now = new Date().getTime();
        const difference = saleEndDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeRemaining(
                `${days}d : ${hours}h : ${minutes}m : ${seconds}s`
            );
        } else {
            setTimeRemaining("Sale has ended");
            await deleteSale(carData.onDiscountSale._id);
        }
    };

    const startTimer = (saleEndDate) => {
        timerId = setInterval(() => calculateTimeRemaining(saleEndDate), 1000);
    };

    const convert = (currDate) => {
        if (!currDate) return "";

        const date = new Date(currDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const calcPrice = (currEndDate) => {
        const now = new Date();
        const end = new Date(currEndDate || endDate);

        const diff = end - now;

        if (diff <= 0) {
            return 0;
        }

        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        setPrices({
            ...prices,
            commission: days * prices.priceAfterDiscount * 0.05,
            finalPriceForRent: days * prices.priceAfterDiscount,
            rentDays: days,
        });
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();

        selectedDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate <= currentDate) {
            alert("Rent Expiry Date should be greater than the current date.");
            return;
        }

        setEndDate(selectedDate.getTime());

        calcPrice(selectedDate.getTime());
    };

    return (
        <div>
            {carData ? (
                <div className="p-4 flex flex-col gap-4">
                    <h1
                        style={{
                            fontFamily: "SuperBrigadeTitle",
                            letterSpacing: "-0.2rem",
                        }}
                        className="text-2xl md:text-5xl text-center py-8 col-div-1 md:col-div-3 uppercase"
                    >
                        {carData.brand} {carData.model}
                    </h1>
                    <div className="flex flex-col gap-16">
                        <div className="flex flex-col gap-4">
                            <img
                                src={`${API_URL_EWS}/${carData.image}`}
                                alt={carData.title}
                                className="w-full"
                            />
                            <div className="flex flex-col gap-4 w-full">
                                <table className="table-fixed w-full border-collapse border border-gray-300 shadow-lg">
                                    <tbody style={{ fontFamily: "Montserrat" }}>
                                        {type === "Buy" && (
                                            <tr>
                                                <td className="border p-4 font-semibold">
                                                    Price
                                                </td>
                                                <td className="border p-4">
                                                    <div className="text-green-600 text-2xl font-bold">
                                                        $
                                                        {prices.originalPrice.toFixed(
                                                            2
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {type === "Rent" && (
                                            <tr>
                                                <td className="border p-4 font-semibold">
                                                    Rent Price
                                                </td>
                                                <td className="border p-4">
                                                    <div className="flex flex-col md:flex-row md:items-center n gap-2">
                                                        <div className="flex items-center text-green-600 text-2xl font-bold">
                                                            <div>
                                                                $
                                                                {prices.originalPrice.toFixed(
                                                                    2
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-600 ml-2">
                                                                {"Per Day"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {carData.onDiscountSale && (
                                            <tr>
                                                <td className="border p-4 font-semibold">
                                                    Discount
                                                </td>
                                                <td className="border p-4">
                                                    <div className="flex flex-col justify-start md:flex-row md:items-center gap-2 md:gap-4 lg:gap-8">
                                                        <div className="text-red-500 text-2xl font-semibold rounded inline-block">
                                                            {"-$" +
                                                                prices.discountedPrice.toFixed(
                                                                    2
                                                                )}
                                                        </div>
                                                        <div className="bg-blue-500 text-white font-semibold px-4 py-2 rounded inline-block">
                                                            {
                                                                carData
                                                                    .onDiscountSale
                                                                    .discountPercentage
                                                            }
                                                            % Off
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {type === "Buy" &&
                                            carData.onDiscountSale && (
                                                <tr>
                                                    <td className="border p-4 font-semibold">
                                                        Discounted Price
                                                    </td>
                                                    <td className="border p-4">
                                                        <div className="flex flex-col md:flex-row md:items-center n gap-2">
                                                            <div className="text-green-600 text-2xl font-bold">
                                                                $
                                                                {prices.priceAfterDiscount.toFixed(
                                                                    2
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        {type === "Rent" &&
                                            carData.onDiscountSale && (
                                                <tr>
                                                    <td className="border p-4 font-semibold">
                                                        Discounted Rent Price
                                                    </td>
                                                    <td className="border p-4">
                                                        <div className="flex flex-col md:flex-row md:items-center n gap-2">
                                                            <div className="flex items-center text-green-600 text-2xl font-bold">
                                                                <div>
                                                                    $
                                                                    {prices.priceAfterDiscount.toFixed(
                                                                        2
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-600 ml-2">
                                                                    {"Per Day"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        {type === "Rent" && (
                                            <>
                                                <tr>
                                                    <td className="border p-4 font-semibold">
                                                        Rent Expiry Date
                                                    </td>
                                                    <td className="border p-4">
                                                        <input
                                                            name="description"
                                                            type="date"
                                                            value={convert(
                                                                endDate
                                                            )}
                                                            onChange={
                                                                handleDateChange
                                                            }
                                                            className="w-full border p-2"
                                                        ></input>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="border p-4 font-semibold">
                                                        Total Days
                                                    </td>
                                                    <td className="border p-4">
                                                        <div className="flex flex-col md:flex-row md:items-center n gap-2">
                                                            <div className="flex items-center text-2xl font-bold">
                                                                <div>
                                                                    {`${
                                                                        prices.rentDays
                                                                    } ${
                                                                        prices.rentDays ===
                                                                        1
                                                                            ? "Day"
                                                                            : "Days"
                                                                    }`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-4 font-semibold">
                                                        Price To Pay
                                                    </td>
                                                    <td className="border p-4">
                                                        <div className="flex flex-col md:flex-row md:items-center n gap-2">
                                                            <div className="flex items-center text-green-600 text-2xl font-bold">
                                                                <div>
                                                                    {`$${prices.finalPriceForRent.toFixed(
                                                                        2
                                                                    )}`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                        <tr>
                                            <td className="border p-4 font-semibold">
                                                Gear Go Commission
                                            </td>
                                            <td className="border p-4">
                                                <div className="flex flex-col justify-start md:flex-row md:items-center gap-2 md:gap-4 lg:gap-8">
                                                    <div className="text-green-600 text-2xl font-semibold rounded inline-block">
                                                        {"+$" +
                                                            prices.commission}
                                                    </div>
                                                    <div className="bg-blue-500 text-white font-semibold px-4 py-2 rounded inline-block">
                                                        {5}%
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="border-2 border-black border-solid">
                                            <td
                                                style={{
                                                    fontFamily:
                                                        "SuperBrigadeCondensed",
                                                    letterSpacing: "0.1rem",
                                                }}
                                                className="border p-4 text-2xl font-semibold"
                                            >
                                                Final Price To Pay
                                            </td>
                                            {type === "Buy" && (
                                                <td className="border p-4">
                                                    <div
                                                        style={{
                                                            fontFamily:
                                                                "Roboto",
                                                            letterSpacing:
                                                                "-0.04rem",
                                                        }}
                                                        className="text-green-600 text-4xl font-bold"
                                                    >
                                                        $
                                                        {prices.finalPrice.toFixed(
                                                            2
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                            {type === "Rent" && (
                                                <td className="border p-4">
                                                    <div
                                                        style={{
                                                            fontFamily:
                                                                "Roboto",
                                                            letterSpacing:
                                                                "-0.04rem",
                                                        }}
                                                        className="italic text-green-600 text-4xl font-bold"
                                                    >
                                                        $
                                                        {(
                                                            prices.finalPriceForRent +
                                                            prices.commission
                                                        ).toFixed(2)}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    </tbody>
                                </table>
                                {carData.owner._id !== user._id && (
                                    <div className="flex w-full justify-center p-4">
                                        <PaymentButton
                                            amount={
                                                type === "Buy"
                                                    ? prices.finalPrice
                                                    : prices.finalPriceForRent +
                                                      prices.commission
                                            }
                                            type={type}
                                            user={user._id}
                                            carId={carData._id}
                                            owner={carData.owner._id}
                                            endDate={endDate}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <table className="table-fixed w-full border-collapse border border-gray-300 shadow-lg">
                                <thead
                                    style={{
                                        fontFamily: "SuperBrigadeCondensed",
                                        letterSpacing: "0.1rem",
                                    }}
                                >
                                    <tr className="bg-black text-white">
                                        <th className="p-4 w-1/2 md:w-1/4 text-left">
                                            Attribute
                                        </th>
                                        <th className="p-4 w-3/4 text-left">
                                            Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontFamily: "Montserrat" }}>
                                    {carData.onDiscountSale && (
                                        <tr>
                                            <td className="border p-4 font-semibold">
                                                Discount
                                            </td>
                                            <td className="border p-4">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 lg:gap-8">
                                                    <div className="bg-blue-500 text-white text-center font-semibold px-4 py-2 rounded inline-block">
                                                        On Sale{" "}
                                                        {
                                                            carData
                                                                .onDiscountSale
                                                                .discountPercentage
                                                        }
                                                        % Off
                                                    </div>
                                                    <div className="flex md:flex-row flex-col gap-2 italic text-red-500 font-semibold">
                                                        <div>
                                                            Time Remaining:{" "}
                                                        </div>
                                                        <div>
                                                            {timeRemaining ||
                                                                "Calculating..."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {type === "Buy" && (
                                        <tr>
                                            <td className="border p-4 font-semibold">
                                                Price
                                            </td>
                                            <td className="border p-4">
                                                {carData.onDiscountSale ? (
                                                    <div className="flex flex-col md:flex-row md:items-center n gap-2">
                                                        <div className="text-green-600 text-2xl font-bold">
                                                            $
                                                            {(
                                                                carData.price *
                                                                (1 -
                                                                    carData
                                                                        .onDiscountSale
                                                                        .discountPercentage /
                                                                        100)
                                                            ).toFixed(2)}
                                                        </div>
                                                        <div className="line-through text-gray-500">
                                                            $
                                                            {carData.price.toFixed(
                                                                2
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-green-600 text-2xl font-bold">
                                                        $
                                                        {carData.price.toFixed(
                                                            2
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {type === "Rent" && (
                                        <tr>
                                            <td className="border p-4 font-semibold">
                                                Rent Price
                                            </td>
                                            <td className="border p-4">
                                                {carData.onDiscountSale ? (
                                                    <div className="flex flex-col md:flex-row md:items-center n gap-2">
                                                        <div className="flex items-center text-green-600 text-2xl font-bold">
                                                            <div>
                                                                $
                                                                {(
                                                                    carData.rentPrice *
                                                                    (1 -
                                                                        carData
                                                                            .onDiscountSale
                                                                            .discountPercentage /
                                                                            100)
                                                                ).toFixed(2)}
                                                            </div>
                                                            <div className="text-sm text-gray-600 ml-2">
                                                                {"Per Day"}
                                                            </div>
                                                        </div>
                                                        <div className="line-through text-gray-500">
                                                            $
                                                            {carData.rentPrice.toFixed(
                                                                2
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-green-600 text-2xl font-bold">
                                                        $
                                                        {carData.rentPrice.toFixed(
                                                            2
                                                        )}
                                                        <div className="text-sm text-gray-600 ml-2">
                                                            {" Per Day"}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td className="border p-4 font-semibold">
                                            Year
                                        </td>
                                        <td className="border p-4">
                                            {carData.year}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-4 font-semibold">
                                            Car Type
                                        </td>
                                        <td className="border p-4">
                                            {carData.title}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-4 font-semibold">
                                            Fuel Type
                                        </td>
                                        <td className="border p-4">
                                            {carData.fuelType}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-4 font-semibold">
                                            Mileage
                                        </td>
                                        <td className="border p-4">
                                            {carData.mileage} km/l
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-4 font-semibold">
                                            Transmission
                                        </td>
                                        <td className="border p-4">
                                            {carData.transmission}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-4 font-semibold">
                                            Location
                                        </td>
                                        <td className="border p-4">
                                            {`${carData.location.city}, ${carData.location.state}, ${carData.location.country} - ${carData.location.zipCode}`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-4 font-semibold">
                                            Date Listed
                                        </td>
                                        <td className="border p-4">
                                            {new Date(
                                                carData.dateListed
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border p-4 font-semibold">
                                            Seller
                                        </td>
                                        <td className="border p-4">
                                            {carData.owner.name}
                                            {userId &&
                                                userId ===
                                                    carData.owner._id && (
                                                    <span className="text-green-500 font-bold ml-2">
                                                        (You)
                                                    </span>
                                                )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default Purchase;
