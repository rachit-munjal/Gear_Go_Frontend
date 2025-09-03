import { useEffect, useState } from "react";
import { API_URL_EWS } from "../../../utils/constants";
import Car from "../../../components/pages/car";
import { useAuth } from "../../../context/context";
import Loading from "../../../components/loading";

const Buy = () => {
    const [carsData, setCarsData] = useState(null);
    const { user, loading } = useAuth();
    const [userId, setUserId] = useState(null);
    const [brands, setBrands] = useState([]);
    const [setNoCars, setNoCarsData] = useState(false);

    // Filters state
    const [filters, setFilters] = useState({
        brand: "all",
        fuelType: "all",
        transmission: "all",
        minPrice: 0,
        maxPrice: 10000000,
        minYear: 2000,
        maxYear: new Date().getFullYear(),
    });

    useEffect(() => {
        if (!loading) {
            setUserId(user ? user._id : null);
        }
    }, [user, loading]);

    const fetchCarData = async () => {
        const query = new URLSearchParams({
            type: "buy",
            brand: filters.brand,
            fuelType: filters.fuelType,
            transmission: filters.transmission,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minYear: filters.minYear,
            maxYear: filters.maxYear,
        });

        const response = await fetch(`${API_URL_EWS}/api/cars/?${query}`);

        if (response.ok && response.status === 204) {
            setCarsData([]);
            setNoCarsData(true);
            return;
        }

        const data = await response.json();

        if (data.error) {
            alert(data.error);
        }
        setCarsData(data.data);
        setBrands(data.brands);
    };

    useEffect(() => {
        fetchCarData();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    if (!carsData || !brands) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1
                style={{
                    fontFamily: "SuperBrigadeTitle",
                    letterSpacing: "-0.2rem",
                }}
                className="text-2xl md:text-5xl text-center py-8 col-span-1 md:col-span-3 uppercase"
            >
                Buy a Car
            </h1>

            <div className="flex gap-4 flex-wrap">
                <select
                    className="border p-2 rounded"
                    onChange={(e) =>
                        handleFilterChange("brand", e.target.value)
                    }
                >
                    <option value="all">All Brands</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>

                <select
                    className="border p-2 rounded"
                    onChange={(e) =>
                        handleFilterChange("fuelType", e.target.value)
                    }
                >
                    <option value="all">All Fuel Types</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                </select>

                <select
                    className="border p-2 rounded"
                    onChange={(e) =>
                        handleFilterChange("transmission", e.target.value)
                    }
                >
                    <option value="all">All Transmissions</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                </select>

                <input
                    type="number"
                    placeholder="Min Price"
                    className="border p-2 rounded"
                    onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                    }
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    className="border p-2 rounded"
                    onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                    }
                />
                <input
                    type="number"
                    placeholder="Min Year"
                    className="border p-2 rounded"
                    onChange={(e) =>
                        handleFilterChange("minYear", e.target.value)
                    }
                />
                <input
                    type="number"
                    placeholder="Max Year"
                    className="border p-2 rounded"
                    onChange={(e) =>
                        handleFilterChange("maxYear", e.target.value)
                    }
                />
                <input
                    type="reset"
                    value="Reset"
                    className="border px-6 py-2 rounded cursor-pointer bg-black text-white font-bold"
                    onClick={() => {
                        setFilters({
                            brand: "all",
                            fuelType: "all",
                            transmission: "all",
                            minPrice: 0,
                            maxPrice: 1000000,
                            minYear: 2000,
                            maxYear: new Date().getFullYear(),
                        });
                        setNoCarsData(false);
                    }}
                />
            </div>

            {setNoCars && (
                <h1
                    style={{
                        fontFamily: "SuperBrigadeTitle",
                        letterSpacing: "-0.2rem",
                    }}
                    className="text-2xl text-center"
                >
                    No Cars Available
                </h1>
            )}

            {/* Cars Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {carsData.map((car) => {
                    if (car.isAvailableForSale) {
                        return (
                            <Car
                                key={car._id}
                                car={car}
                                buyOrRent={true}
                                userId={userId}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default Buy;
