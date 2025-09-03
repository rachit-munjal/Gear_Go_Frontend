import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./slides.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";
import { API_URL_EWS } from "../../../utils/constants";

const Slides = ({ slides }) => {
    const [timeLeft, setTimeLeft] = useState([]);

    useEffect(() => {
        const calcTimeLeft = (deadline) => {
            const curr = new Date();
            const end = new Date(deadline);

            const diff = end - curr;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                return {
                    days,
                    hours,
                    minutes,
                    seconds,
                };
            } else {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                };
            }
        };

        const updateTimers = () => {
            const newTimeLeft = slides.map((slide) =>
                calcTimeLeft(slide.saleDate)
            );
            setTimeLeft(newTimeLeft);
        };

        updateTimers();
        const timerId = setInterval(updateTimers, 1000);

        return () => clearInterval(timerId); // Cleanup interval on unmount
    }, [slides]);

    const mySwiper = useRef(null);

    useEffect(() => {
        const id = setInterval(() => {
            if (mySwiper.current) {
                mySwiper.current.slideNext();
            }
        }, 5000);

        return () => clearInterval(id);
    }, []);

    const calculateDiscountedPrice = (price, discountPercentage) =>
        Math.round(price - (price * discountPercentage) / 100);

    return (
        <div className="flex flex-col justify-between overflow-x-hidden">
            <div className="flex items-center">
                <Swiper
                    onSwiper={(s) => (mySwiper.current = s)}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    speed={1000}
                    loop={true}
                    modules={[Navigation, Pagination]}
                    pagination={{ clickable: true }}
                    className="swiper-container flex"
                >
                    {slides.map((s, i) => (
                        <SwiperSlide key={s._id}>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 md:p-8 lg:p-16">
                                <div className="flex w-full md:w-1/2 justify-center items-center">
                                    <img
                                        src={`${API_URL_EWS}/${s.car.image}`}
                                        alt={s.car.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="bg-blue-500 px-4 py-2 max-w-max rounded-full text-white font-semibold text-lg">
                                            Sale :- {s.discountPercentage}% OFF
                                        </div>
                                        <Link
                                            to={`/car/${s.car._id}`}
                                            className="bg-green-500 px-4 py-2 max-w-max rounded-full text-white font-semibold text-lg"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                    <h1
                                        className="text-white text-2xl md:text-4xl lg:text-5xl font-bold"
                                        style={{
                                            fontFamily: "SuperBrigadeTitle",
                                        }}
                                    >
                                        {s.car.brand}{" "}{s.car.model}
                                    </h1>
                                    <h2
                                        className="text-white text-xl italic md:text-2xl lg:text-3xl"
                                        style={{
                                            fontFamily: "Montserrat",
                                            letterSpacing: "-0.05rem",
                                        }}
                                    >
                                        {s.car.title}
                                    </h2>
                                    <h3
                                        className="text-white text-xl italic md:text-2xl lg:text-3xl"
                                        style={{
                                            fontFamily: "Montserrat",
                                            letterSpacing: "-0.05rem",
                                        }}
                                    >
                                        {s.discountPercentage ? (
                                            <div className="flex md:flex-row flex-col md:items-end gap-1 md:gap-2 lg:gap-4">
                                                <div className="text-gray-300 text-2xl">
                                                    Price :-
                                                </div>
                                                <div className="flex md:flex-row flex-col md:items-end gap-2">
                                                    <div className="text-5xl font-bold text-green-500 mb-[-0.12rem]">
                                                        $
                                                        {calculateDiscountedPrice(
                                                            s.car.price,
                                                            s.discountPercentage
                                                        )}
                                                    </div>
                                                    <div className="line-through text-2xl text-gray-500">
                                                        ${s.car.price}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            `Price: $${s.car.price}`
                                        )}
                                    </h3>
                                    <h3
                                        className="text-white text-xl italic md:text-2xl lg:text-3xl"
                                        style={{
                                            fontFamily: "Montserrat",
                                            letterSpacing: "-0.05rem",
                                        }}
                                    >
                                        {s.discountPercentage ? (
                                            <div className="flex md:flex-row flex-col md:items-end gap-1 md:gap-2 lg:gap-4">
                                                <div className="text-gray-300 text-2xl">
                                                    Rent Price :-
                                                </div>
                                                <div className="flex md:flex-row flex-col md:items-end gap-2">
                                                    <div className="text-5xl font-bold text-green-500 mb-[-0.12rem]">
                                                        $
                                                        {calculateDiscountedPrice(
                                                            s.car.rentPrice,
                                                            s.discountPercentage
                                                        )}
                                                    </div>
                                                    <div className="line-through text-2xl text-gray-500">
                                                        ${s.car.rentPrice}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            `Rent Price: $${s.car.rentPrice}`
                                        )}
                                    </h3>

                                    {timeLeft[i] && (
                                        <div>
                                            <h5
                                                className="text-yellow-400 text-md md:text-lg lg:text-2xl font-semibold"
                                                style={{
                                                    fontFamily:
                                                        "SuperBrigadeCondensed",
                                                    letterSpacing: "0.15rem",
                                                }}
                                            >
                                                Time Left:
                                            </h5>
                                            <h5
                                                className="text-red-500 italic text-2xl lg:text-4xl font-semibold"
                                                style={{
                                                    fontFamily: "Montserrat",
                                                    letterSpacing: "-0.05rem",
                                                }}
                                            >
                                                {`
                                                    ${timeLeft[i].days}d 
                                                    ${timeLeft[i].hours}h 
                                                    ${timeLeft[i].minutes}m 
                                                    ${timeLeft[i].seconds}s
                                                `}
                                            </h5>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Slides;
