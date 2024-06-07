import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row items-center w-screen justify-center">
      <button
        className="rounded-md bg-blue-500 text-white p-4"
        onClick={() => navigate("/login")}
      >
        Login / Sign up
      </button>
    </div>
  );
}

export default App;
