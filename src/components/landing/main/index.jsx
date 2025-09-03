import Card from "./card";

const Welcome = () => {
    const cards = [
        {
            title: "Buy Car",
            description: "Buy your dream car at the best price",
            link: "/car/buy",
            image: "/cards/buy.jpg",
        },
        {
            title: "Sell Car",
            description: "Sell your car at the best price",
            link: "/car/sell",
            image: "/cards/sell.jpg",
        },
        {
            title: "Rent Car",
            description: "Rent a car for your needs",
            link: "/car/rent",
            image: "/cards/rent.jpg",
        },
    ];

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
                    Expo Wheels
                </h1>
                <p
                    style={{
                        fontFamily: "SuperBrigadeCondensed",
                    }}
                    className="text-center text-lg md:text-2xl"
                >
                    Drive Your Dream, Your Way
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card item={cards[0]} />
                <Card item={cards[1]} />
                <Card item={cards[2]} />
            </div>
        </div>
    );
};

export default Welcome;
