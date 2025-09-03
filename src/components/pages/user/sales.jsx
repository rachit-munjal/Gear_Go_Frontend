import { Link } from "react-router-dom";
import { API_URL_EWS } from "../../../utils/constants";
import { useEffect, useState } from "react";
import { deleteBooking } from "../../../utils/booking";

const Car = ({ car, buyOrRent }) => {
    const [timeRemaining, setTimeRemaining] = useState(null);

    const [priceDetails, setPriceDetails] = useState({
        price: car.price,
        rentPrice: car.rentPrice,
    });

    const formatDate = (date) => {
        const dateObj = new Date(date);

        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        return `${months[month - 1]} ${day}, ${year}`;
    };

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
            clearInterval(timerId);
            setTimeRemaining("Rent End Date Passed");
        }
    };

    const startTimer = (saleEndDate) => {
        timerId = setInterval(() => calculateTimeRemaining(saleEndDate), 1000);
    };

    const getDiscountedPrice = (currPrice) => {
        if (!currPrice) {
            currPrice = car.price;
        }

        const price = currPrice;

        if (car.onDiscountSale) {
            const discount = car.onDiscountSale.discountPercentage || 0;
            return (price - price * (discount / 100)).toFixed(2);
        }
        return price;
    };

    useEffect(() => {
        if (car.endDate) {
            const saleEndDate = new Date(car.endDate).getTime();
            calculateTimeRemaining(saleEndDate);
            startTimer(saleEndDate);
        }

        setPriceDetails({
            price: getDiscountedPrice(car.price),
            rentPrice: getDiscountedPrice(car.rentPrice),
        });
    }, []);

    const handleDeleteBooking = async (id) => {
        window.alert("Please Wait for Verifying the Car Delivery");

        try {
            const response = await deleteBooking(id);

            if (response.ok) {
                alert("Booking Deleted Successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error Deleting Booking: ", error);
        }
    };

    return (
        <div className="flex flex-col gap-4 rounded-md p-4 shadow-2xl md:hover:scale-105 cursor-pointer transition">
            <div className="flex flex-col gap-4 w-full">
                <h1
                    className="text-lg md:text-2xl text-center py-4 col-span-1 md:col-span-3 uppercase"
                    style={{
                        fontFamily: "SuperBrigadeTitle",
                        letterSpacing: "-0.1rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {car.brand} {car.model}
                </h1>

                <img
                    src={`${API_URL_EWS}/${car.image}`}
                    alt={car.title}
                    style={{
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                    }}
                    className="rounded-md"
                />
            </div>
            <div className="flex h-full justify-between flex-col gap-4 p-4">
                <div
                    className="flex flex-col h-full justify-center gap-2"
                    style={{ fontFamily: "Poppins" }}
                >
                    <div className="flex flex-col justify-between gap-4 items-center">
                        <div className="flex justify-between gap-4 items-center w-full">
                            <div className="flex flex-col">
                                {buyOrRent &&
                                    car.isAvailableForSale &&
                                    (car.onDiscountSale ? (
                                        <div>
                                            <div className="text-green-600 text-2xl lg:text-3xl font-bold">
                                                ${priceDetails.price}
                                            </div>
                                            <div className="text-gray-600 text-sm line-through">
                                                ${car.price}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-green-600 text-2xl lg:text-3xl font-bold">
                                            ${car.price}
                                        </div>
                                    ))}
                                {buyOrRent &&
                                    car.isAvailableForSale &&
                                    car.onDiscountSale !== null && (
                                        <div className="bg-blue-500 text-sm px-2 py-1 text-white font-semibold md:text-xl md:px-4 md:py-2 rounded text-center">
                                            Sale (
                                            {
                                                car.onDiscountSale
                                                    .discountPercentage
                                            }
                                            % Off)
                                        </div>
                                    )}
                            </div>
                            <div className="flex flex-col gap-2 items-center">
                                {buyOrRent &&
                                    car.isAvailableForRent &&
                                    (car.onDiscountSale ? (
                                        <div className="flex flex-col">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-green-600 text-2xl lg:text-3xl font-bold">
                                                    ${priceDetails.rentPrice}
                                                </span>
                                                <span className="text-sm">
                                                    Per Day
                                                </span>
                                            </div>
                                            <div className="text-gray-600 text-sm line-through">
                                                ${car.rentPrice}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 items-center">
                                            <span className="text-green-600 text-2xl lg:text-3xl font-bold">
                                                ${car.rentPrice}
                                            </span>
                                            <span className="text-sm">
                                                Per Day
                                            </span>
                                        </div>
                                    ))}
                                {buyOrRent &&
                                    car.isAvailableForRent &&
                                    car.onDiscountSale !== null && (
                                        <div className="bg-blue-500 text-white font-semibold px-4 py-2 rounded text-center">
                                            Sale (
                                            {
                                                car.onDiscountSale
                                                    .discountPercentage
                                            }
                                            % Off)
                                        </div>
                                    )}
                            </div>
                        </div>
                        {car.pricePaid && (
                            <div className="flex flex-col items-center gap-2 w-full">
                                <div className="text-green-600 text-2xl w-full text-center lg:text-4xl font-bold">
                                    ${car.pricePaid}
                                </div>
                                {car.endDate && (
                                    <div className="flex flex-col items-center w-full italic text-red-500 font-semibold">
                                        <div className="text-center">
                                            Time Remaining For Rent End:{" "}
                                        </div>
                                        <div className="text-center">
                                            {timeRemaining || "Calculating..."}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex gap-2 items-center justify-between w-full">
                            <p
                                className="italic"
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {car.description}
                            </p>
                            <span className="text-2xl">{car.fuelType}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Car Type:</span>
                        <span>{car.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Mileage:</span>
                        <span>{car.mileage} km</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold">Transmission:</span>
                        <span>{car.transmission}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold">Date Listed:</span>
                        <span>{formatDate(car.dateListed)}</span>
                    </div>
                </div>
                {buyOrRent && (
                    <Link
                        to={`/car/edit/${car._id}`}
                        className="w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-900 text-center transition"
                    >
                        Edit Details
                    </Link>
                )}
                {buyOrRent && (
                    <div
                        onClick={() => handleDelete(car._id)}
                        className="w-full bg-red-700 text-white font-semibold py-2 rounded hover:bg-red-900 text-center transition"
                    >
                        Delete Car
                    </div>
                )}
                {car.bookType === "Rent" && (
                    <div
                        onClick={() => handleDeleteBooking(car.booking)}
                        className="w-full bg-yellow-700 text-white font-semibold py-2 rounded hover:bg-yellow-900 text-center transition"
                    >
                        Car Delivered
                    </div>
                )}
                {
                    <Link
                        to={`/car/${car._id}`}
                        className="flex flex-col gap-4"
                    >
                        <button className="w-full bg-green-700 text-white font-semibold py-2 rounded hover:bg-green-900 transition">
                            View Details
                        </button>
                    </Link>
                }
            </div>
        </div>
    );
};

export default Car;
