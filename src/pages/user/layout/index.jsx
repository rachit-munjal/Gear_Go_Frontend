import { useEffect, useState } from "react";

import SalesCard from "../../../components/pages/user/sales";

const Layout = ({ title, data, showDetails }) => {
    const [currData, setCurrData] = useState([]);

    useEffect(() => {
        if (data) setCurrData(data);
        console.log("Sales", data);
    }, [data]);

    return (
        <div className="flex flex-col justify-center items-center p-4 md:p-8 lg:p-16">
            <h1
                style={{
                    fontFamily: "SuperBrigadeTitle",
                    letterSpacing: "-0.2rem",
                }}
                className="text-5xl md:text-6xl text-center font-bold"
            >
                {title}
            </h1>
            <h2>
                {currData && currData.length === 0 && (
                    <p className="text-center text-xl mt-4">No {title} found</p>
                )}
            </h2>

            {currData && currData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {currData.map((item, index) => (
                        <SalesCard
                            key={item._id}
                            car={item}
                            buyOrRent={showDetails}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Layout;
