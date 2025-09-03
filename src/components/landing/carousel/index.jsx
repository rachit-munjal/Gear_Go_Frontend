import { useEffect, useState } from "react";
import Slides from "./slides";
import { API_URL_EWS } from "../../../utils/constants";

const Carousel = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await fetch(`${API_URL_EWS}/api/sales/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${localStorage.getItem("eWauthToken")}`,
                    },
                });
                const data = await response.json();
                // console.log("Data", data.data);
                setSalesData(data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSalesData();
    }, []);

    if (!salesData || salesData.length <= 0) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-[50vh] justify-center w-full bg-gradient-to-r from-black via-[#222222] to-[#000000]">
            <Slides slides={salesData} />
        </div>
    );
};

export default Carousel;
