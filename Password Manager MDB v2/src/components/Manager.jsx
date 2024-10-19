import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    const token = localStorage.getItem("token"); // Retrieve token
    let req = await fetch("http://localhost:3000/passwords", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}` // Add token to headers
      }
    });
    let passwords = await req.json();
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    if (ref.current.src.includes("icons/eye.png")) {
      ref.current.src = "icons/eyecross.png";
      passwordRef.current.type = "password";
    } else {
      passwordRef.current.type = "text";
      ref.current.src = "icons/eye.png";
    }
  };

  const savePassword = async () => {
    const token = localStorage.getItem("token");
    if (form.site.length > 2) {
      const newPassword = { ...form, id: form.id || uuidv4() };

      // Add token to headers for both POST and PUT requests
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      // Check if it's an edit or new entry
      if (form.id) {
        // If it's an edit, make a PUT request
        await fetch(`http://localhost:3000/passwords/${form.id}`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(newPassword),
        });
      } else {
        // If it's a new password, make a POST request
        await fetch("http://localhost:3000/passwords", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(newPassword),
        });
      }

      // Update password array and reset form
      setPasswordArray([
        ...passwordArray.filter((item) => item.id !== form.id),
        newPassword,
      ]);

      // Clear the form and show toast
      setform({ site: "", username: "", password: "" });
      toast.success("Password saved!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.error("Password not saved", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      toast.warning("Site name should be more than 2 characters", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const deletePassword = async (id) => {
    const token = localStorage.getItem("token");
    let c = confirm("Do you want to delete this password?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));

      await fetch(`http://localhost:3000/passwords/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id }),
      });

      toast.error("Password deleted!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editPassword = async (id) => {
    // Find the entry to edit and set it in the form
    const passwordToEdit = passwordArray.find((i) => i.id === id);
    setform(passwordToEdit);

    // Remove the entry from the table so it doesn't show up during editing
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const evaluatePasswordStrength = (password) => {
    let strength = 5;

    if (password.length >= 8) strength += 20; // Length
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[0-9]/.test(password)) strength += 25; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special characters

    return strength;
  };

  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState("");

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setform({ ...form, password: password });

    const strengthValue = evaluatePasswordStrength(password);
    setStrength(strengthValue);

    if (strengthValue <= 10) {
      setStrengthText("Password too weak!! 💀");
    } else if (strengthValue <= 25) {
      setStrengthText("Not good enough 😔");
    } else if (strengthValue <= 50) {
      setStrengthText("Now thats something!! 👍");
    } else if (strengthValue <= 75) {
      setStrengthText("Great! that's a strong password 🥳");
    } else {
      setStrengthText("Very strong password!! 🤩🎉");
    }
  };

  const getStrengthColor = (strength) => {
    if (strength <= 10) return "red";
    if (strength <= 25) return "orange";
    if (strength <= 50) return "yellow";
    if (strength <= 75) return "green";
    return "#00ff00";
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="min-h-screen inset-0 -z-10  w-full items-center px-5  [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] md:minh">

        <div className="p-8 md:mycontainer">
          <h1 className="text-4xl text-white font-bold text-center">
            <span className="text-blue-500">&lt;</span>
            Pass
            <span className="text-blue-500">M&gt;</span>
          </h1>
          <p className="text-lg text-blue-600 text-center">
            The Password Manager
          </p>
          <div className="text-black flex flex-col p-4 gap-6 items-center">
            <input
              value={form.site}
              onChange={handleChange}
              placeholder="Enter Website URL"
              className="rounded-full border-2 border-blue-400 w-full p-4 py-1"
              type="text"
              name="site"
              id="site"
            />
            <div className="flex flex-col md:flex-row w-full items-center gap-8">
              <input
                value={form.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className="rounded-full border-2 border-blue-400 w-full md:w-1/2 p-2 py-1"
                type="text"
                name="username"
                id="username"
              />
              <div className="w-full relative md:w-1/2">
                <input
                  ref={passwordRef}
                  value={form.password}
                  onChange={handlePasswordChange}
                  placeholder="Enter Password"
                  className="rounded-full border-2 border-blue-400 w-full p-2 py-1"
                  type="password"
                  name="password"
                  id="password"
                />
                <span
                  className="absolute right-[2px] top-[4.1px] cursor-pointer"
                  onClick={() => {
                    showPassword();
                  }}
                >
                  <img
                    ref={ref}
                    className="p-1"
                    width={30}
                    src="icons/eyecross.png"
                    alt="eye"
                  />
                </span>
              </div>
            </div>

            <div className="password-strength w-56 text-center relative">
              <div
                className="strength-bar absolute left-1/2 h-2"
                style={{
                  width: `${strength}%`,
                  backgroundColor: getStrengthColor(strength),
                  transform: "translateX(-50%)",
                }}
              ></div>
              <p className="text-white text-sm mt-3 ">{strengthText}</p>
            </div>

            <button
              onClick={savePassword}
              className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-400 rounded-full px-6 py-1.5 w-fit"
            >
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="hover"
              ></lord-icon>
              Save
            </button>
          </div>

          <div className="passwords text-white overflow-x-auto">
            <h2 className="font-bold text-2xl py-5">Your Passwords</h2>
            {passwordArray.length === 0 && <div>No passwords are there</div>}
            {passwordArray.length != 0 && (
              <table className="table-auto w-full rounded-lg overflow-hidden mb-10 text-xs sm:text-base">
                <thead className="bg-violet-900">
                  <tr>
                    <th>Site</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/10">
                  {passwordArray.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="py-1 text-center">
                          <div className="flex items-center justify-center ">
                            <a href={item.site} target="_blank">
                              {item.site}
                            </a>
                            <div
                              className="lordiconcopy size-7 cursor-pointer"
                              onClick={() => {
                                copyText(item.site);
                              }}
                            >
                              <lord-icon
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  paddingTop: "3px",
                                  paddingLeft: "3px",
                                  filter: "invert(1)",
                                }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-1 text-center">
                          <div className="flex items-center justify-center ">
                            <span>{item.username}</span>
                            <div
                              className="lordiconcopy size-7 cursor-pointer"
                              onClick={() => {
                                copyText(item.username);
                              }}
                            >
                              <lord-icon
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  paddingTop: "3px",
                                  paddingLeft: "3px",
                                  filter: "invert(1)",
                                }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="py-1 text-center">
                          <div className="flex items-center justify-center ">
                            <span>{"*".repeat(item.password.length)}</span>
                            <div
                              className="lordiconcopy size-7 cursor-pointer"
                              onClick={() => {
                                copyText(item.password);
                              }}
                            >
                              <lord-icon
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  paddingTop: "3px",
                                  paddingLeft: "3px",
                                  filter: "invert(1)",
                                }}
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                              ></lord-icon>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span
                            className="cursor-pointer mx-1"
                            onClick={() => {
                              editPassword(item.id);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/gwlusjdu.json"
                              trigger="hover"
                              style={{
                                width: "25px",
                                height: "25px",
                                filter: "invert(1)",
                              }}
                            ></lord-icon>
                          </span>
                          <span
                            className="cursor-pointer mx-1"
                            onClick={() => {
                              deletePassword(item.id);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/skkahier.json"
                              trigger="hover"
                              style={{
                                width: "25px",
                                height: "25px",
                                filter: "invert(1)",
                              }}
                            ></lord-icon>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Manager;
