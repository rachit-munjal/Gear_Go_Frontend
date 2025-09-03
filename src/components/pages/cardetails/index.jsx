import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL_EWS } from "../../../utils/constants";
import { deleteSale } from "../../../utils/sales";
import { useAuth } from "../../../context/context";
import Loading from "../../loading";
import { deleteCar } from "../../../utils/services/car";

const CarDetails = () => {
    const { id } = useParams();
    const [carData, setCarData] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);

    const navigate = useNavigate();

    const { user, loading, admin } = useAuth();

    const [userId, setUserId] = useState(null);

    const handleDelete = async (carId) => {
        if (!window.confirm("Are you sure you want to delete this car?")) {
            return;
        }

        const response = await deleteCar(carId);
        if (response.ok) {
            alert("Car Deleted Successfully");
            navigate("/car/buy");
        } else {
            alert("Error Deleting Car");
        }
    };

    useEffect(() => {
        if (!loading) {
            if (user) {
                setUserId(user._id);
            } else {
                setUserId(null);
            }
        }
    }, [user, loading]);

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

            if (!response.ok) {
                alert("Error Fetching Car Data");
                window.history.back();
                return;
            }

            setCarData(data.data);

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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="flex flex-col gap-4">
                            <img
                                src={`${API_URL_EWS}/${carData.image}`}
                                alt={carData.title}
                                className="w-full"
                            />
                            <div
                                className="flex flex-col gap-4 w-full justify-center"
                                style={{
                                    fontFamily: "SuperBrigadeCondensed",
                                    letterSpacing: "0.1rem",
                                }}
                            >
                                {!userId && (
                                    <Link
                                        to={`/login`}
                                        className="font-bold bg-black w-full text-center text-white p-4 rounded-md"
                                    >
                                        Please Login to Buy or Rent
                                    </Link>
                                )}
                                {userId &&
                                    userId !== carData.owner._id &&
                                    carData.isAvailableForSale && (
                                        <Link
                                            to={`/car/purchase/${carData._id}?type=Buy`}
                                            className="font-bold bg-black w-full text-center text-white p-4 rounded-md"
                                        >
                                            Buy Now
                                        </Link>
                                    )}
                                {((userId && userId !== carData.owner._id) ||
                                    admin) &&
                                    carData.isAvailableForRent && (
                                        <Link
                                            to={`/car/purchase/${carData._id}?type=Rent`}
                                            className="font-bold w-full bg-black text-center text-white p-4 rounded-md"
                                        >
                                            Rent Now
                                        </Link>
                                    )}
                                {((userId && userId === carData.owner._id) ||
                                    admin) &&
                                    (carData.isAvailableForSale ||
                                        carData.isAvailableForRent) && (
                                        <Link
                                            to={`/car/edit/${carData._id}`}
                                            className="italic hover:bg-blue-900 text-white p-4 bg-blue-700 font-semibold rounded text-center"
                                        >
                                            Edit Details
                                        </Link>
                                    )}
                                {((userId && userId === carData.owner._id) ||
                                    admin) &&
                                    (carData.isAvailableForSale ||
                                        carData.isAvailableForRent) && (
                                        <div
                                            onClick={() =>
                                                handleDelete(carData._id)
                                            }
                                            className="italic text-white hover:bg-red-900 p-4 bg-red-700 font-semibold rounded cursor-pointer text-center"
                                        >
                                            Delete Car
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
                                    {carData.isAvailableForSale && (
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
                                    {carData.isAvailableForRent && (
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
                                            Fuel Type
                                        </td>
                                        <td className="border p-4">
                                            {carData.fuelType}
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

export default CarDetails;
