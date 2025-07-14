import { SiGooglegemini } from "react-icons/si";
import { FaFileCsv, FaFilePdf, FaFileSignature, FaPlus } from "react-icons/fa6";
import Backdrop from "./Backdrop";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Create from "./Create";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Backdrop />
      <div
        id="hero"
        className="pageSection flex flex-col justify-center items-center text-5xl/[100%]"
      >
        <h1 className="w-[50%] my-[3%] text-center font-bold text-white font-serif">
          Design Your Pitch Deck Template with AI
        </h1>
        <h2 className="w-[65%] my-[1%] text-center text-[53%]/[110%]">
          Instantly create a Google Slides template—designed specifically for
          your company
        </h2>
        <div
          id="CTA Container"
          className="absolute top-[75%] w-[25%] flex justify-center my"
        >
          <Create href="#How It Works" />
        </div>
        <div
          id="geminiLogo"
          className="absolute top-[83%] w-1/2 h-[10%] flex justify-center items-center"
        >
          <SiGooglegemini className="h-[45%]" />
          <span className="text-[32%] ml-[2%] text-gray-300">
            {" "}
            Powered by Google Gemini
          </span>
        </div>
      </div>
      <div
        id="How It Works"
        className="pageSection w-full flex flex-col justify-center items-center text-5xl/[100%] font-serif"
      >
        <p className="text-[80%] my-[2%] font-bold">How it works</p>
        <div id="step" className="flex justify-center w-[80%] h-[15%]">
          <div className=" h-full w-[20%] flex justify-center items-center text-center">
            <span className="text-[300%]">1.</span>
          </div>
          <div className=" h-full w-full text-[50%] flex items-end">
            <p>
              Provide Gemini with context related to your industry/solution. You
              can do this by answering a couple of brief questions, or by
              uploading a file.
            </p>
          </div>
        </div>
        <span className="w-[70%] my-[1%]">|</span>
        <div id="step" className="flex justify-center w-[80%] h-[15%]">
          <div className=" h-full w-[20%] flex justify-center items-center text-center">
            <span className="text-[300%]">2.</span>
          </div>
          <div className=" h-full w-full text-[50%] flex items-end">
            <p>
              Gemini will generate a text-based outline of your pitch deck.
              Review it and share your feedback—ensuring the content, tone, and
              wording align with your expectations.
            </p>
          </div>
        </div>
        <span className="w-[70%] my-[1%]">|</span>
        <div id="step" className="flex justify-center w-[80%] h-[15%] my-[1%">
          <div className=" h-full w-[20%] flex justify-center items-center text-center">
            <span className="text-[300%]">3.</span>
          </div>
          <div className=" h-full w-full text-[50%] flex items-end">
            <p>
              Give Gemini the go-ahead to build your full slide deck. It’ll be
              waiting in your Google Drive!
            </p>
          </div>
        </div>
      </div>
      <div
        id="Get Started"
        className="pageSection w-full flex flex-col justify-center items-center text-5xl/[100%] font-serif"
      >
        <p className="text-[80%] my-[2%] font-bold">
          Choose an option below to get started (You will be asked to sign in to
          Google):
        </p>

        <div className="w-[70%] h-[65%] my-[3%] flex flex-col items-center">
          <div
            id="cards-container"
            className="flex items-end justify-around w-[120%] h-[85%] my-[2%]"
          >
            <div
              id="card"
              className="w-[27%] border-1 border-gray-500 h-full rounded-3xl flex flex-col justify-center items-center bg-blue-800 hover:-translate-y-1 transition-all duration-400 hover:cursor-pointer hover:outline-2"
              onClick={() =>
                navigate("/chat", {
                  state: {
                    type: "uploadFile",
                  },
                })
              }
            >
              <FaPlus className="my-[6%]" />
              <h1 className="text-center text-[55%] font-bold">
                Upload a PDF file
              </h1>
              <p className="text-[36%] mt-[1%] mb-[8%] text-center leading-[120%] px-[9%]">
                (Company Profile or Executive Summary)
              </p>
              <FaFilePdf className="size-[40%]" />
            </div>
            <div
              id="card"
              className="w-[27%] border-1 border-gray-500 h-full rounded-3xl flex flex-col justify-center items-center bg-blue-800 hover:-translate-y-1 transition-all duration-400 hover:cursor-pointer hover:outline-2"
              onClick={() => navigate("/form")}
            >
              <FaPlus className="my-[6%]" />
              <h1 className="text-center text-[55%] font-bold">
                Fill out a short form
              </h1>
              <p className="text-[36%] mt-[1%] mb-[8%] text-center leading-[120%] px-[9%]">
                (Only takes a few moments)
              </p>
              <FaFileSignature className="size-[40%]" />
            </div>
            <div
              id="card"
              className="w-[27%] border-1 border-gray-500 h-full rounded-3xl flex flex-col justify-center items-center bg-blue-800 hover:-translate-y-1 transition-all duration-400 hover:cursor-pointer hover:outline-2"
              onClick={() =>
                navigate("/chat", {
                  state: {
                    type: "uploadFile",
                  },
                })
              }
            >
              <FaPlus className="my-[6%]" />
              <h1 className="text-center text-[55%] font-bold">
                Upload a CSV file
              </h1>
              <p className="text-[36%] mt-[1%] mb-[8%] text-center leading-[120%] px-[9%]">
                (If you have a database of individual companies)
              </p>
              <FaFileCsv className="size-[40%]" />
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400">Created by: Gabriel Ramirez</p>
      </div>
    </>
  );
}

export default Home;
