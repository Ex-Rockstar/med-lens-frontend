import React from "react";
import Scan from "./Scan";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="bg-amber-100 h-screen">
        <h2 className="text-8xl font-mono px-7 py-6">
          <span className="font-light font-sans">Med-</span>Lens
        </h2>
        <Link to="/scan" className="block px-7">
          <button class="bg-transparent hover:bg-amber-500 text-amber-700 font-semibold hover:text-white py-2 px-7 border border-amber-500 hover:border-transparent rounded">
            Click To Scan~
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;
