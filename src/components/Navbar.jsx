import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className="sticky top-0 z-50 flex justify-between items-center h-20 max-w-[1600px] mx-auto px-2 text-white bg-white">
      <ul className="hidden text-2xl  text-[#755e33]  md:flex">
        <Link to="/">
          <li className="p-4 hover:text-[#DBB700]">Home</li>
        </Link>
        <Link to="/scan" className="block">
          <li
            className="p-4 hover:text-[#DBB700]"
            
          >
            Scan
          </li>
        </Link>

        <Link to="/contact">
          <li className="p-4 hover:text-[#DBB700]">Contact Us</li>
        </Link>

      </ul>
    </div>
  );
};

export default Navbar;
