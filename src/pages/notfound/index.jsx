import { Link } from "react-router-dom";
import Navbar from "../../components/landing/navbar";

const NotFound = () => {
    return (
        <div>
            <div
                style={{
                    fontFamily: "SuperBrigadeTitle",
                    letterSpacing: "-0.1rem",
                }}
                className="flex w-full min-h-screen mt-[-5rem] justify-center flex-col gap-4 items-center"
            >
                <h1 className="text-4xl text-center font-bold uppercase">
                    404 Page Not Found
                </h1>
                <Link className="bg-black text-white rounded px-4 py-2" to="/">
                    Go to Home Page
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
