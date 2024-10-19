import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Lander = () => {
  return (
    <>
    <Navbar />
      <div className="h-screen inset-0 -z-10  w-full items-center px-5  [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] md:minh">
        
        <div className="items-center flex flex-col m-10 mt-0"><img className="w-20 h-20" src="/vite.svg" alt="PassM logo" /></div>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-blue-500">&lt;</span>
            <span className="text-white">Secure Your Passwords with</span>
            <span className="text-white"> Pass</span>
            <span className="text-blue-500">M&gt;</span>
          </h1>
          <p className="text-2xl font-light text-white">
            The ultimate solution to manage your passwords securely and easily.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6 text-white">
          <div className="flex justify-center">
            <div className="bg-black bg-opacity-60 p-4 rounded-lg shadow-md w-72 text-center">
              <h2 className="text-xl font-semibold mb-2">Why Choose Us?</h2>
              <ul className="text-sm space-y-1">
                <li>✔ AES-256 Encryption</li>
                <li>✔ Secure Cloud Backup</li>
                <li>✔ Easy Access Anywhere</li>
                <li>✔ Password Strength Indicator</li>
              </ul>
            </div>
          </div>

          <button className="w-60 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition-colors duration-300">
            <Link to='/auth'>Get Started</Link>
            
          </button>

        </div>
      </div>
    </>
  );
};

export default Lander;