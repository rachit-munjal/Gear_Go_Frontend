import React, { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Carousel from "./carousel";
import Welcome from "./main";

const Title = () => {
    const animate = useAnimationControls();
    const cardAnimate = useAnimationControls();

    const [show, setShow] = useState(true);

    useEffect(() => {
        const animationKey = "expoWheelsAnimation";
        const expirationKey = "expoWheelsAnimationExpiration";
        const expirationTime = 4 * 60 * 60 * 1000;

        const hasAnimationPlayed = localStorage.getItem(animationKey);
        const savedTime = localStorage.getItem(expirationKey);

        if (hasAnimationPlayed && savedTime) {
            const now = Date.now();
            const isExpired = now - parseInt(savedTime, 10) > expirationTime;

            if (!isExpired) {
                setShow(false);
                cardAnimate.start({
                    opacity: 1,
                    transition: {
                        duration: 1,
                    },
                });
                return;
            } else {
                localStorage.removeItem(animationKey);
                localStorage.removeItem(expirationKey);
            }
        }

        animate
            .start({
                opacity: 1,
                transition: {
                    delay: 0.25,
                    duration: 0.5,
                },
            })
            .then(() => {
                return animate.start({
                    y: 0,
                    opacity: 0,
                    transition: {
                        delay: 0.375,
                        duration: 0.5,
                    },
                });
            })
            .then(() => {
                setShow(false);
                localStorage.setItem(animationKey, "true");
                localStorage.setItem(expirationKey, Date.now().toString());
            })
            .then(() => {
                cardAnimate.start({
                    opacity: 1,
                    transition: {
                        duration: 1,
                    },
                });
            });
    }, [animate, cardAnimate]);

    return (
        <div
            style={{ fontFamily: "Poppins" }} // 25f1d3
            className="flex flex-col min-h-screen w-full"
        >
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 250 }}
                    animate={animate}
                    className="flex flex-col items-center gap-1 max-h-max p-4"
                >
                    <div className="grid grid-cols-4">
                        <h1
                            style={{
                                fontFamily: "SuperBrigadeTitle",
                                letterSpacing: "-0.5rem",
                            }}
                            className="text-5xl md:text-7xl text-center col-span-1 md:col-span-3 uppercase"
                        >
                            Gear Go
                        </h1>
                        <div></div>
                    </div>
                    <div className="grid grid-cols-4">
                        <div></div>
                        <p
                            style={{
                                fontFamily: "SuperBrigadeCondensed",
                                letterSpacing: "0.5rem",
                            }}
                            className="text-2xl col-span-3  text-center tracking-wide"
                        >
                            Drive Your Dream, Your Way
                        </p>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={cardAnimate}
            >
                <Welcome />
                <Carousel />
            </motion.div>
        </div>
    );
};

export default Title;
