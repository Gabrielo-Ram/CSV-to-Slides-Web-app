import { FaGoogle } from "react-icons/fa";
import { IoLockClosedSharp } from "react-icons/io5";

function LogInLogOut({ status }) {
  return status ? (
    <button className="border-2 border-gray-700 flex items-center justify-around rounded-2xl bg-blue-800 p-2 hover:outline-3 hover:bg-blue-700 hover:cursor-pointer transition-all duration-200 w-full">
      <FaGoogle className="h-[80%]" />
      <p className="text-[30%]/6 lg:text-[50%] 2xl:text-[75%]">
        Sign In with Google
      </p>
    </button>
  ) : (
    <button className="border-2 border-gray-700 flex items-center justify-around rounded-2xl bg-purple-900 p-2 hover:outline-3 hover:bg-purple-800 hover:cursor-pointer transition-all duration-200 w-full">
      <IoLockClosedSharp className="h-[80%]" />
      <p className="text-[30%]/6 lg:text-[50%] 2xl:text-[75%]">
        Log out of Google
      </p>
    </button>
  );
}

export default LogInLogOut;
