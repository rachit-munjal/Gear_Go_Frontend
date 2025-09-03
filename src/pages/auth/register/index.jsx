import { useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../../../utils/auth";
import { motion } from "framer-motion";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/context";
import { SECRET_KEY } from "../../../utils/constants";

const Register = () => {
    const navigate = useNavigate();
    const { setUser, setAdmin } = useAuth();

    const [details, setDetails] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value,
        });

        validateInput(e.target.name, e.target.value);
    };

    const validateInput = (name, value) => {
        let error = "";

        switch (name) {
            case "name":
                if (value.trim().length < 3) {
                    error = "Name must be at least 3 characters long.";
                }
                break;

            case "email":
                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
                    value.includes("..") ||
                    value.includes("@.") ||
                    value.includes(".@")
                ) {
                    error = "Invalid email address.";
                }
                break;

            case "password":
                if (value.length < 8) {
                    error = "Password must be at least 8 characters long.";
                } else if (
                    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
                        value
                    )
                ) {
                    error =
                        "Password must include a letter, a number, and a special character.";
                }
                break;

            case "confirmPassword":
                if (value !== details.password) {
                    error = "Passwords do not match.";
                }
                break;

            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        Object.keys(details).forEach((key) => validateInput(key, details[key]));
        if (Object.values(errors).some((error) => error)) {
            setLoading(false);
            return;
        }

        try {
            const response = await createUser(details);

            if (response) {
                alert(response.message);
                setUser(response.user);

                if (response.user.role === SECRET_KEY) {
                    setAdmin(response.user);
                } else {
                    setAdmin(null);
                }

                navigate("/");
            } else {
                alert("User not created.");
            }

            setDetails({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            alert(error.message);
        }

        setLoading(false);
    };

    return (
        <div className="flex md:flex-row flex-col p-0 min-h-screen">
            <div
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(/auth-bg.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="flex flex-col py-8 pt-20 md:min-h-screen justify-center w-full"
            >
                <Link
                    to="/"
                    className="absolute top-4 md:top-7 flex gap-2 justify-center items-center left-4 md:left-7 p-2 md:p-4 bg-white text-black rounded font-bold"
                >
                    <FaChevronLeft />
                    <div className="text-sm md:text-xl">Go Back</div>
                </Link>
                <div
                    className="text-2xl md:text-4xl text-white text-center"
                    style={{ fontFamily: "SuperBrigadeTitle" }}
                >
                    Welcome to Gear Go
                </div>
                <div
                    className="text-md md:text-2xl text-white text-center p-4"
                    style={{ fontFamily: "SuperBrigadeCondensed" }}
                >
                    Drive your dream, Your way
                </div>
            </div>
            <div className="w-full p-8 md:p-4 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: { delay: 0.1, duration: 0.25 },
                    }}
                    className="flex flex-col justify-center items-center w-full md:w-3/5 px-4 py-8 bg-black border-2 border-solid border-black gap-4 rounded"
                >
                    <div
                        className="font-bold text-3xl text-white text-center"
                        style={{ fontFamily: "SuperBrigadeTitle" }}
                    >
                        Sign Up
                    </div>
                    <div className="md:w-4/5 w-full flex flex-col gap-4">
                        {["name", "email", "password", "confirmPassword"].map(
                            (field) => (
                                <div
                                    key={field}
                                    className="flex flex-col gap-2"
                                >
                                    <label
                                        className="text-white"
                                        htmlFor={field}
                                    >
                                        {field === "confirmPassword"
                                            ? "Confirm Password"
                                            : field.charAt(0).toUpperCase() +
                                              field.slice(1)}
                                    </label>
                                    <input
                                        className={`p-2 border-2 rounded ${
                                            errors[field]
                                                ? "border-red-500"
                                                : "border-black"
                                        }`}
                                        type={
                                            field.includes("password") ||
                                            field.includes("Password")
                                                ? "password"
                                                : field === "email"
                                                ? "email"
                                                : "text"
                                        }
                                        id={field}
                                        name={field}
                                        value={details[field]}
                                        onChange={handleChange}
                                    />
                                    {errors[field] && (
                                        <span className="text-red-500 text-sm">
                                            {errors[field]}
                                        </span>
                                    )}
                                </div>
                            )
                        )}
                        <div className="text-center font-bold text-white">
                            Already Have an Account ?{" "}
                            <Link to="/login" className="hover:underline">
                                Login
                            </Link>
                        </div>
                        <button
                            onClick={handleFormSubmit}
                            disabled={
                                loading ||
                                Object.values(errors).some((error) => error)
                            }
                            className={`${
                                loading ||
                                Object.values(errors).some((error) => error)
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-white"
                            } px-4 py-2 rounded w-full`}
                        >
                            {loading ? "Please Wait..." : "Register"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
