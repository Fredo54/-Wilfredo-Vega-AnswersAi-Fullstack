import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../hooks/use-user";
import { useState } from "react";
import logo from "../assets/logo.svg";

export const DashboardNav = () => {
  const navigate = useNavigate();
  const { chatTokens: tokenCount, setToken } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    setToken(undefined);
    Cookies.remove("accessToken");
    navigate("/login");
  };

  const tokenMessage =
    tokenCount !== undefined && tokenCount < 0 ? 0 : tokenCount;
  const lowTokenAlert = tokenCount !== undefined && tokenCount < 100;

  return (
    <>
      <nav className="hidden justify-center items-end h-screen w-1/5 md:flex">
        <ul className="flex flex-col gap-4 p-4">
          <li>Token Tracker</li>
          {lowTokenAlert && (
            <li className="text-red-400">Running low on tokens!</li>
          )}
          <li> {tokenMessage !== undefined ? tokenMessage : "loading..."}</li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>
      <div className="md:hidden h-screen w-1/5">
        <button
          onClick={toggleMenu}
          className="text-white bg-white focus:outline-none"
        >
          <img src={logo} alt="logo" className="w-12 h-12" />
        </button>

        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-medium text-gray-900">Menu</h2>
                <button
                  onClick={toggleMenu}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <ul className="flex flex-col gap-4 p-4">
                  {lowTokenAlert && (
                    <li className="text-red-400">Running low on tokens!</li>
                  )}
                  <li className="text-black justify-center flex">
                    {tokenMessage !== undefined ? tokenMessage : "loading..."}
                  </li>
                  <button onClick={logout}>Logout</button>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
