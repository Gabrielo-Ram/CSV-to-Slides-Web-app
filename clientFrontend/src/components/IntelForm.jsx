import "../index.css";
import Backdrop from "./Backdrop";
import QuestionNavigator from "./QuestionNavigator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosExit } from "react-icons/io";

function IntelForm() {
  const navigate = useNavigate();

  const [questionNumber, setQuestionNumber] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const BACKEND_URL = "http://localhost:3001";
  //Save data into fields when the user hits the submit button.
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [story, setStory] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [market, setMarket] = useState("");
  const [traction, setTraction] = useState("");
  const [ask, setAsk] = useState("");

  const responses = {
    type: "form",
    name: name,
    team: team,
    story: story,
    problem: problem,
    solution: solution,
    market: market,
    traction: traction,
    ask: ask,
  };

  const handleSubmit = () => {
    navigate("/chat", { state: responses });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/user`, {
          credentials: "include",
        });

        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    if (!isAuthenticated) {
      navigate("/");
    }
  });

  return (
    <div className="h-screen w-screen flex justify-center">
      <Backdrop />
      <div
        id="form-container"
        className="w-1/2 h-[90%] my-[3%] bg-gray-700 shadow-2xl rounded-xl bg-radial from-gray-600 to-gray-700"
      >
        <div
          id="exit"
          className="h-[8%] w-[10%] ml-[88%] mt-[1%]"
          onClick={() => navigate("/")}
        >
          <IoIosExit className="size-full hover:cursor-pointer hover:text-blue-500 transition-all duration-200" />
        </div>
        <h1 className="w-full text-center text-5xl font-bold font-serif mb-[5%]">
          Pitch Deck Template
        </h1>
        <QuestionNavigator
          numberOfQuestions={7}
          currentQuestion={questionNumber}
        />
        <div className="w-full text-center text-xl font-serif mb-[5%] px-[2%]">
          {questionNumber === 0 && (
            <>
              <p className="w-full lg:text-[120%] text-[100%] text-center font-serif my-[5%] px-[4%] ">
                Leverage the power of AI to make a short-form pitch deck
                template.
              </p>
              <p className="w-full lg:text-[120%] text-[100%] text-center font-serif my-[5%] px-[4%] ">
                Please take a minute to fill out a questionnaire—your answers
                will help us craft a customized short-form pitch deck template
                tailored specifically to your company.
              </p>
              <p className="w-full lg:text-[120%] text-[100%] text-center font-serif my-[5%] px-[4%] ">
                Bullet points are great! Feel free to include as much (or as
                little) detail as you'd like — the more context you provide, the
                stronger and more tailored your slide deck will be.
              </p>
              <button
                className="mt-[1%] px-6 py-3 rounded-2xl bg-blue-800 text-white text-[130%] font-bold outline-4 outline-hidden hover:bg-blue-600 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(1)}
              >
                Start
              </button>
            </>
          )}
          {questionNumber === 1 && (
            <div>
              <div className="flex justify-center items-center my-[4%]">
                <span className="font-bold w-[30%]">Name of Company:</span>
                <textarea
                  className="w-[60%] ml-[3%] px-3 py-1 rounded border border-gray-400 focus:outline-none focus:ring-2 bg-gray-800 text-white text-[90%]"
                  placeholder="What is the name of your company?"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  rows={1}
                />
              </div>
              <div className="flex justify-center items-center my-[4%]">
                <span className="font-bold w-[30%]">Team Members:</span>
                <textarea
                  className="w-[60%] ml-[3%] px-3 py-1 rounded border border-gray-400 focus:outline-none focus:ring-2 bg-gray-800 text-white text-[90%]"
                  placeholder="Who works on your team? (Eg. John Smith (CEO), Jane Doe, ...)"
                  value={team}
                  onChange={(e) => {
                    setTeam(e.target.value);
                  }}
                  rows={2}
                />
              </div>
              <div className="flex justify-center items-center mt-[4%] mb-[2%]">
                <span className="font-bold w-[30%]">What's your story?</span>
                <textarea
                  className="w-[60%] ml-[3%] px-4 py-3 rounded border border-gray-400 focus:outline-none focus:ring-2 bg-gray-800 text-white text-[90%]"
                  placeholder="How did you come to be? Where did the company begin, and how long have you been in business?"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={8}
                />
              </div>
              <button
                className="mt-3 mx-[1%] px-6 py-3 rounded-2xl bg-gray-600 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-gray-500 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(0)}
              >
                Back
              </button>
              <button
                className="mt-3 mx-[1%] px-6 py-3 rounded-2xl bg-blue-800 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-blue-600 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(2)}
              >
                Next
              </button>
            </div>
          )}
          {questionNumber === 2 && (
            <div>
              <div>
                <p className="w-[90%] justify-self-center">
                  <b>The Problem:</b> What pain point or frustration are you
                  trying to solve? Feel free to use bullet points.
                </p>
                <textarea
                  className="w-[85%] px-6 py-3 my-[3%] rounded border border-gray-400 focus:outline-none focus:ring-2 bg-gray-800 text-white text-[90%]"
                  placeholder="Enter your answer here"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={10}
                />
              </div>
              <button
                className="mx-[1%] px-6 py-3 rounded-2xl bg-gray-600 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-gray-500 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(1)}
              >
                Back
              </button>
              <button
                className="mt-3 mx-[1%] px-6 py-3 rounded-2xl bg-blue-800 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-blue-600 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(3)}
              >
                Next
              </button>
            </div>
          )}
          {questionNumber === 3 && (
            <div>
              <div>
                <p className="w-[90%] justify-self-center">
                  <b>Your Solution:</b> How does your tech solve the problem?
                  Focus on benefits—not just features. Free to use bullet
                  points.
                </p>
                <textarea
                  className="w-[85%] px-6 py-3 my-[3%] rounded border border-gray-400 focus:outline-none focus:ring-2 bg-gray-800 text-white text-[90%]"
                  placeholder="Enter your answer here"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={10}
                />
              </div>
              <button
                className="mx-[1%] px-6 py-3 rounded-2xl bg-gray-600 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-gray-500 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(2)}
              >
                Back
              </button>
              <button
                className="mt-3 mx-[1%] px-6 py-3 rounded-2xl bg-blue-800 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-blue-600 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(4)}
              >
                Next
              </button>
            </div>
          )}
          {questionNumber === 4 && (
            <div>
              <div>
                <p className="w-[90%] justify-self-center">
                  <b>Market:</b> Who is your product built for? Why do they need
                  it? Identify key market segments.
                </p>
                <textarea
                  className="w-[85%] px-6 py-3 my-[3%] rounded border border-gray-400 focus:outline-none focus:ring-2 bg-gray-800 text-white text-[90%]"
                  placeholder="Enter your answer here"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  rows={10}
                />
              </div>
              <button
                className="mx-[1%] px-6 py-3 rounded-2xl bg-gray-600 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-gray-500 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(3)}
              >
                Back
              </button>
              <button
                className="mt-3 mx-[1%] px-6 py-3 rounded-2xl bg-blue-800 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-blue-600 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(5)}
              >
                Next
              </button>
            </div>
          )}
          {questionNumber === 5 && (
            <div>
              <div>
                <p className="w-[90%] justify-self-center">
                  <b>Traction:</b> Why now? What proof do you have that your
                  product is working or needed? Identify any trends, pilots,
                  LOIs, etc.
                </p>
                <textarea
                  className="w-[85%] px-6 py-3 my-[3%] rounded border border-gray-400 focus:outline-none focus:ring-2 bg-gray-800 text-white text-[90%]"
                  placeholder="Enter your answer here"
                  value={traction}
                  onChange={(e) => setTraction(e.target.value)}
                  rows={10}
                />
              </div>
              <button
                className="mx-[1%] px-6 py-3 rounded-2xl bg-gray-600 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-gray-500 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(4)}
              >
                Back
              </button>
              <button
                className="mt-3 mx-[1%] px-6 py-3 rounded-2xl bg-blue-800 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-blue-600 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(6)}
              >
                Next
              </button>
            </div>
          )}
          {questionNumber === 6 && (
            <div>
              <div>
                <p className="w-[90%] justify-self-center">
                  <b>Ask:</b> What are you looking for? Are you raising funding,
                  looking for partnerships, or hiring key talent? Again, bullet
                  points work great!
                </p>
                <textarea
                  className="w-[85%] px-6 py-3 my-[3%] rounded border border-gray-400 focus:outline-none focus:ring-2 bg-gray-800 text-white text-[90%]"
                  placeholder="Enter your answer here"
                  value={ask}
                  onChange={(e) => setAsk(e.target.value)}
                  rows={10}
                />
              </div>
              <button
                className="mx-[1%] px-6 py-3 rounded-2xl bg-gray-600 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-gray-500 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={() => setQuestionNumber(5)}
              >
                Back
              </button>
              <button
                className="mt-3 mx-[1%] px-6 py-3 rounded-2xl bg-green-600 text-white text-2xl font-bold outline-4 outline-hidden hover:bg-green-400 hover:cursor-pointer hover:outline-solid duration-300 transition-all"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IntelForm;
