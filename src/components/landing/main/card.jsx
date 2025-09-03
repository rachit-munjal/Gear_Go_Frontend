import { Link } from "react-router-dom";

const Card = ({ item }) => {
    return (
        <Link
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            to={item.link}
            className="p-4 w-full h-64 flex justify-center items-center rounded hover:transform hover:scale-105 transition-transform duration-500"
        >
            <div className="flex gap-4 flex-col text-white items-center justify-center w-full">
                <h2
                    className="font-black text-3xl text-center md:text-4xl"
                    style={{
                        fontFamily: "SuperBrigade",
                        letterSpacing: "0.15rem",
                    }}
                >
                    {item.title}
                </h2>
                <p className="text-md md:text-xl text-center">
                    {item.description}
                </p>
            </div>
        </Link>
    );
};

export default Card;
