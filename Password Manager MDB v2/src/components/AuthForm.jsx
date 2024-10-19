import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
    // State for tracking which form to display (login or register)
    const [isLogin, setIsLogin] = useState(true);

    // State to hold form input data
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });

    const [strength, setStrength] = useState(0); // Password strength state

    const navigate = useNavigate();

    // Handler for switching between login and registration forms
    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    // Handler for login form input change
    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    // Handler for register form input change
    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        if (e.target.name === "password") {
            evaluatePasswordStrength(e.target.value);
        }
    };

    // Handler for form submission (placeholder logic)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? "http://localhost:3000/login" : "http://localhost:3000/register";
        const data = isLogin ? loginData : registerData;

        if (isLogin && (!loginData.username || !loginData.password)) {
            alert("Please fill in all fields");
            return;
        } else if (!isLogin && (!registerData.username || !registerData.email || !registerData.password)) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message || (isLogin ? "Login successful!" : "Registration successful!"));
                // Store token in localStorage if received
                if (result.token) {
                    localStorage.setItem("token", result.token);

                    // Redirect to the password manager page
                    navigate("/main");
                }
            } else {
                console.error(result.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Password strength evaluation
    const evaluatePasswordStrength = (password) => {
        let strengthScore = 0;
        if (password.length >= 8) strengthScore += 25;
        if (/[A-Z]/.test(password)) strengthScore += 25;
        if (/[0-9]/.test(password)) strengthScore += 25;
        if (/[\W]/.test(password)) strengthScore += 25;
        setStrength(strengthScore);
    };

    return (

        <div className="min-h-screen inset-0 -z-10  w-full items-center px-5  [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] md:minh">



            <div className=" flex flex-col items-center justify-center  px-5">

                <div className="mb-12 mt-6">
                    <h1 className="text-4xl text-white font-bold text-center">
                        <span className="text-blue-500">&lt;</span>
                        Pass
                        <span className="text-blue-500">M&gt;</span>
                    </h1>
                </div>

                <div className="relative w-full max-w-md mb-16 p-8 space-y-8 bg-opacity-20 backdrop-filter backdrop-blur-md bg-white rounded-lg shadow-md transition-all duration-500">
                    <h2 className="text-center text-3xl font-bold text-white transition-all duration-500">
                        {isLogin ? "Login" : "Register"}
                    </h2>

                    <form onSubmit={handleSubmit} className={`space-y-6 ${isLogin ? "fade-in" : "fade-out"}`}>
                        {/* Username */}
                        <div className="relative">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={isLogin ? loginData.username : registerData.username}
                                onChange={isLogin ? handleLoginChange : handleRegisterChange}
                                className="w-full bg-white bg-opacity-20 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Email for Register form */}
                        {!isLogin && (
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    className="w-full bg-white bg-opacity-20 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        {/* Password */}
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={isLogin ? loginData.password : registerData.password}
                                onChange={isLogin ? handleLoginChange : handleRegisterChange}
                                className="w-full bg-white bg-opacity-20 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Password Strength Bar for Registration */}
                        {!isLogin && (
                            <div className="password-strength mt-2">
                                <div className="w-full bg-gray-300 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${strength < 50
                                            ? "bg-red-500"
                                            : strength < 75
                                                ? "bg-yellow-500"
                                                : "bg-green-500"
                                            }`}
                                        style={{ width: `${strength}%` }}
                                    ></div>
                                </div>
                                <p className="text-white text-xs mt-1">Password strength: {strength}%</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition-colors duration-300"
                        >
                            {isLogin ? "Login" : "Register"}
                        </button>
                    </form>

                    {/* Toggle Between Forms */}
                    <div className="text-center">
                        <p className="text-white">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <button
                            onClick={toggleForm}
                            className="text-blue-400 hover:text-blue-600 transition-all duration-500 mt-2"
                        >
                            {isLogin ? "Register here" : "Login here"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
