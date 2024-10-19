import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen inset-0 -z-10  w-full items-center px-5  [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] md:minh">
      <div className=" flex flex-col items-center justify-center  px-5">
        <div className="text-white font-bold relative w-full max-w-md mb-16 p-8 space-y-8 bg-opacity-20 backdrop-filter backdrop-blur-md bg-white rounded-lg shadow-md transition-all duration-500 text-center mt-52">
          <h1>Error - 404 page Not Found</h1>
          <h2>Either this link is inactive or unavailable</h2>
          <h3>Please go back to <span className="px-1 w-60 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition-colors duration-300"><Link to='/'>Home</Link></span> page</h3>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
