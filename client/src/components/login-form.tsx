import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import Cookies from "js-cookie";
import { useUser } from "../hooks/use-user";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setEmail, setId, setToken } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      console.log(formData);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setEmail(data.email);
        setId(data.userId);
        setToken(data.token);
        Cookies.set("accessToken", data.token, { expires: 1 });
        navigate("/dashboard", { state: { email: data.email } });
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while trying to login. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img src={logo} alt="logo" className="w-12 h-12 mb-4 text-blue-600" />
          <h2 className="text-lg font-bold leading-8 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-gray-500">
            Enter your email and password to sign in
          </p>
        </div>
        <form className="flex flex-col pt-6 gap-y-2" onSubmit={handleSubmit}>
          {error && <p className="text-red-400">{error}</p>}
          <input
            type="email"
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            className="px-4 py-2 mt-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full"
          >
            Sign in
          </button>
        </form>
        <Link to="/register">
          <p className="mt-4 text-sm text-gray-500">
            Don't have an account? Sign up
          </p>
        </Link>
      </div>
    </div>
  );
};
