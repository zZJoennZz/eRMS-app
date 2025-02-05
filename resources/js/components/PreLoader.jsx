import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loadingAnimation.json";

export default function PreLoader() {
    return (
        <div className="bg-white z-50 w-full h-screen absolute top-0 left-0">
            <Lottie
                animationData={loadingAnimation}
                loop={true}
                className="w-1/2 m-auto"
            />
        </div>
    );
}
