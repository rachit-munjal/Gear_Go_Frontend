import { Link } from "react-router-dom";
import { API_URL_EWS } from "../../../utils/constants";
import { deleteCar } from "../../../utils/services/car";

const Car = ({ car, buyOrRent }) => {
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

    const getDiscountedPrice = () => {
        const price = buyOrRent ? car.price : car.rentPrice;

        if (car.onDiscountSale) {
            const discount = car.onDiscountSale.discountPercentage || 0;
            return (price - price * (discount / 100)).toFixed(2);
        }
        return price;
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
                                        <>
                                            <span className="text-green-600 text-2xl lg:text-3xl font-bold">
                                                ${getDiscountedPrice()}
                                            </span>
                                            <span className="text-gray-600 text-sm line-through">
                                                $
                                                {buyOrRent
                                                    ? car.price
                                                    : car.rentPrice}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-green-600 text-2xl lg:text-3xl font-bold">
                                            $
                                            {buyOrRent
                                                ? car.price
                                                : car.rentPrice}
                                        </span>
                                    ))}
                                {!buyOrRent &&
                                    car.isAvailableForRent &&
                                    (car.onDiscountSale ? (
                                        <>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-green-600 text-2xl lg:text-3xl font-bold">
                                                    ${getDiscountedPrice()}
                                                </span>
                                                <span className="text-sm">
                                                    Per Day
                                                </span>
                                            </div>
                                            <span className="text-gray-600 text-sm line-through">
                                                ${car.rentPrice}
                                            </span>
                                        </>
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
                            </div>
                            <div>
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
                                {!buyOrRent &&
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
                        <div className="flex gap-2 items-center justify-between w-full">
                            <p
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                                className="italic"
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
                    <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold">Seller Name:</span>
                        <span>{car.owner.name}</span>
                    </div>
                </div>
                {/* {((userId && userId === car.owner._id) || admin) && (
                    <Link
                        to={`/car/edit/${car._id}`}
                        className="w-full bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-900 text-center transition"
                    >
                        Edit Details
                    </Link>
                )}
                {((userId && userId === car.owner._id) || admin) && (
                    <div
                        onClick={() => handleDelete(car._id)}
                        className="w-full bg-red-700 text-white font-semibold py-2 rounded hover:bg-red-900 text-center transition"
                    >
                        Delete Car
                    </div>
                )} */}
                {buyOrRent &&
                    (car.isAvailableForSale ? (
                        <Link
                            to={`/car/${car._id}`}
                            className="flex flex-col gap-4"
                        >
                            <button className="w-full bg-green-700 text-white font-semibold py-2 rounded hover:bg-green-900 transition">
                                View Details
                            </button>
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <button className="w-full bg-gray-500 text-white font-semibold py-2 rounded hover:cursor-not-allowed transition">
                                Currently Not Available
                            </button>
                        </div>
                    ))}
                {!buyOrRent &&
                    (car.isAvailableForRent ? (
                        <Link
                            to={`/car/${car._id}`}
                            className="flex flex-col gap-4"
                        >
                            <button className="w-full bg-green-700 text-white font-semibold py-2 rounded hover:bg-green-900 transition">
                                View Details
                            </button>
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <button className="w-full bg-gray-500 text-white font-semibold py-2 rounded hover:cursor-not-allowed transition">
                                Currently Not Available
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Car;
