import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Create() {
  const navigate = useNavigate();

  return (
    <button
      className="border-2 border-gray-700 flex items-center justify-around rounded-2xl bg-blue-800 p-2 hover:outline-3 hover:bg-blue-700 hover:cursor-pointer transition-all duration-200 w-full"
      onClick={() => navigate("/form")}
    >
      <FaPlus className="h-full" />
      <p className="text-[30%] lg:text-[50%] 2xl:text-[75%]">
        Create a New Template
      </p>
    </button>
  );
}

export default Create;
