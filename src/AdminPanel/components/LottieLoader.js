import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading_animations/loading-1.json"

const LottieLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" />
    </div>
  );
};

export default LottieLoader;
