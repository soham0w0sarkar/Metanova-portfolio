// src/components/Home.jsx
import React from "react";
import logo from "/assets/logo.png";

const Home = () => {
  return (
    <div className="relative w-full h-full text-white pointer-events-auto">
      {/* Logo in top-left corner */}
      <img
        src={logo}
        alt="Logo"
        className="absolute top-4 left-4 w-52 h-52 object-contain"
      />

      {/* Hero content */}
      <div className="flex flex-col items-center justify-end h-full text-center  px-4 py-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Engineering <span className="text-blue-400">Tomorrow</span>, Today.
        </h1>
      </div>
    </div>
  );
};

export default Home;
