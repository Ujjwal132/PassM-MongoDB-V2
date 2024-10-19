import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="text-white bg-black ">
      <div className="mycontainer flex justify-between items-center px-5 py-5 h-12">
        <div className="logo font-bold text-white text-2xl">
          <span className="text-blue-500">&lt;</span>
          Pass
          <span className="text-blue-500">M&gt;</span>
        </div>
        <div>
          <div className="gap-4 flex">
            <button className="hover:underline ">
              <NavLink
                to="/"
                className={({ isActive }) =>
                isActive ? "w-auto px-2 py-1 font-semibold justify-center items-center gap-2 bg-blue-600 hover:bg-blue-400 rounded-xl" : ""}>
                  Home
              </NavLink>
               
            </button>
            <button className="hover:underline ">
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                isActive ? "w-auto px-2 py-1 font-semibold justify-center items-center gap-2 bg-blue-600 hover:bg-blue-400 rounded-xl" : ""}>
                  Login
              </NavLink>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
