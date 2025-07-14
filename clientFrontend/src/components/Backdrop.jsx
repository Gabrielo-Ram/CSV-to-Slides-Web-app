import "../index.css";

function Backdrop() {
  return (
    <div
      id="Concentric Circle Webpage"
      className="absolute w-screen h-screen flex justify-center items-center overflow-hidden -z-10 blur-md"
    >
      <div className="absolute size-300 rounded-full bg-blue-950 opacity-30"></div>
      <div className="absolute size-200 rounded-full bg-blue-800 opacity-10"></div>
      <div className="absolute size-110 rounded-full bg-blue-700 opacity-10"></div>
      <div className="absolute size-50 rounded-full bg-blue-600 opacity-20"></div>
    </div>
  );
}

export default Backdrop;
