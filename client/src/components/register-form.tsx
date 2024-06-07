import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import Cookies from "js-cookie";

export const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(event.target.value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    if (!fullName || !email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log("register response: ", data);
      Cookies.set("accessToken", data.token, { expires: 1 });
      navigate("/dashboard");
    } else {
      setErrorMsg(data.error);
    }
    console.log("register response: ", data);

    console.log({ fullName, email, password });
  };

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col items-center">
        <img src={logo} alt="logo" className="w-12 h-12 mb-4 text-blue-600" />
        <h2 className="text-lg font-bold leading-8 tracking-tight">
          Create an account
        </h2>
        <p className="text-gray-500">Enter your details to create an account</p>
      </div>
      <form className="flex flex-col pt-6 gap-y-2" onSubmit={handleSubmit}>
        {errorMsg && <p className="text-red-400">{errorMsg}</p>}
        <input
          type="text"
          className="px-4 py-2 mt-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Full Name"
          name="fullName"
          onChange={handleFullNameChange}
        />
        <input
          type="email"
          className="px-4 py-2 mt-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Email"
          name="email"
          onChange={handleEmailChange}
        />
        <input
          type="password"
          className="px-4 py-2 mt-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Password"
          name="password"
          onChange={handlePasswordChange}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full"
        >
          Sign up
        </button>
      </form>
      <Link to="/login">
        <p className="mt-4 text-sm text-gray-500">
          Already have an account? Login
        </p>
      </Link>
    </div>
  );
};
