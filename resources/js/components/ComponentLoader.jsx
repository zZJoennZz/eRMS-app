import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/componentLoading.json";

export default function ComponentLoader() {
    return (
        <div className="w-1/2 object-contain m-auto">
            <Lottie
                animationData={loadingAnimation}
                loop={true}
                className="w-1/2 m-auto my-12"
            />
        </div>
    );
}
