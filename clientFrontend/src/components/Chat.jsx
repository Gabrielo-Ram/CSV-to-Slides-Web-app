import "../index.css";
import { SlArrowUpCircle } from "react-icons/sl";
import { FaPlus } from "react-icons/fa6";
import { RiGeminiFill } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Chat({ systemPrompt }) {
  const chatRef = useRef(null);
  const [userQuery, setUserQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const BACKEND_URL = "http://localhost:3001";

  //Guard flag for useEffect()
  const hasFired = useRef(false);

  //Upon first render of this component, send the user's access token and the system prompt to the MCP and return response
  useEffect(() => {
    //Ensures we only send this information ONCE
    if (hasFired.current) return;
    hasFired.current = true;

    async function sendSystemPrompt() {
      setLoading(true);
      try {
        //Calls a route that prompts the Express backend to send the access token in a message to the MCP Client
        const sendToken = await fetch(`${BACKEND_URL}/sendToken`, {
          method: "GET",
          credentials: "include",
        }).catch((error) => {
          throw new Error(
            `Failure when calling /sendToken endpoint: \n${error.message}`
          );
        });

        //Calls MCP endpoint
        const response = await fetch(`${BACKEND_URL}/processQuery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: systemPrompt }),
        });

        const data = await response.json();

        if (data?.reply) {
          setMessages((prev) => [...prev, data.reply]);
        } else {
          setMessages((prev) => [...prev, "No response from server"]);
        }
      } catch (error) {
        console.error("Error calling /processQuery: ", error);
        setMessages((prev) => [
          ...prev,
          "Failed to reach server... please try again later!",
        ]);
      } finally {
        setLoading(false);
      }
    }

    sendSystemPrompt();
  }, []);

  //On submit, validate the user's input and submit the prompt to MCP
  const handleSubmit = async () => {
    if (userQuery.trim() === "" || loading) {
      return;
    }

    //Add user prompt to messages array
    setMessages((prev) => [...prev, userQuery]);
    setUserQuery("");
    setLoading(true);

    //Submit the prompt to MCP ecosystem
    await submitQueryToMCP(userQuery);

    setLoading(false);
  };

  //Submits the user's query to our MCP
  const submitQueryToMCP = async (query) => {
    try {
      //Calls our MCP endpoint
      //TODO: Replace URL in fetch with backend URL
      const response = await fetch(`${BACKEND_URL}/processQuery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      if (data?.reply) {
        setMessages((prev) => [...prev, data.reply]);
      } else {
        setMessages((prev) => [...prev, "No response from server"]);
      }
    } catch (error) {
      console.error("Error calling /processQuery: ", error);
      setMessages((prev) => [
        ...prev,
        "Failed to reach server... please try again later!",
      ]);
    }
  };

  //Processes and reads an uploaded file (CSV/PDF)
  const uploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        //Converts a CSV file into text and sends it to LLM
        if (fileType === "text/csv") {
          const csvText = event.target?.result;
          if (typeof csvText === "string") {
            //TODO: Replace URL in fetch with backend URL
            const res = await fetch(`${BACKEND_URL}/processCSV`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ csv: csvText }),
            });

            if (!res.ok) {
              const errorText = await res.text(); // catch unexpected HTML or text
              console.error("Upload failed:", errorText);
              setMessages((prev) => [...prev, "[ Upload Failed ]", errorText]);
              return;
            }

            const data = await res.json();

            if (data?.reply) {
              setMessages((prev) => [
                ...prev,
                "[ Uploaded CSV File ]",
                data.reply,
              ]);
            }

            console.log("CSV successfully uploaded");
          }
          //Reads and sends raw binary data to LLM
        } else if (fileType === "application/pdf") {
          const pdfArrayBuffer = event.target?.result;

          //TODO: Replace URL in fetch with backend URL
          const res = await fetch(`${BACKEND_URL}/processPDF`, {
            method: "POST",
            body: pdfArrayBuffer,
            headers: {
              "Content-Type": "application/pdf",
            },
          });

          if (!res.ok) {
            setMessages((prev) => [
              ...prev,
              "[ Failed to upload PDF file ",
              data.reply,
            ]);
          }

          const data = await res.json();

          if (data?.reply) {
            setMessages((prev) => [
              ...prev,
              "[ Uploaded PDF File ]",
              data.reply,
            ]);
          }

          console.log("PDF successfully uploaded");
        } else {
          console.error("Unsupported file type");
        }
      } catch (err) {
        console.error("File upload failed:\n", err);
      }
    };

    // Read based on type
    if (fileType === "application/pdf") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  //Automatically scrolls to the bottom of the chatbox
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="pageSection flex flex-col justify-end items-center">
      <div
        id="displayChat"
        className="bg-gray-800/50 mb-[8%] h-[73.5%] w-5/8 py-[3%] pb-[7%] overflow-y-auto flex flex-col text-lg"
        ref={chatRef}
      >
        {messages.map((message, index) => {
          if (index % 2 !== 0) {
            return (
              <p
                key={`user-${index}`}
                className="text-lg rounded-xl self-end max-w-1/2 bg-gray-600 px-[2%] py-[1%] my-[1%] break-words"
              >
                {message}
              </p>
            );
          } else {
            return (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                key={`bot-${index}`}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-3xl font-bold mb-4" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-semibold mt-8 mb-2"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-2xl font-bold mt-6 mb-1" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-3 leading-relaxed text-gray-100"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="list-disc list-inside ml-4 mb-1"
                      {...props}
                    />
                  ),
                }}
              >
                {message}
              </ReactMarkdown>
            );
          }
        })}
      </div>

      <div
        id="userInputContainer"
        className="absolute bg-blue-950 mb-[2%] h-6/32 w-5/8 rounded-4xl flex flex-col border-2 border-gray-700"
      >
        <textarea
          id="userInput"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask anything"
          className="w-[99%] h-[70%] px-[4%] py-[3%] rounded-4xl overflow-y-auto focus:outline-none text-xl"
        ></textarea>
        <div
          id="chatIcons"
          className="flex justify-between flex-grow pb-2 px-[5%]"
        >
          <label
            htmlFor="uploadCSV"
            className="h-full w-[5%] rounded-2xl border-2 border-gray-300 hover:bg-blue-600 hover:cursor-pointer hover:rounded-lg transition-all duration-200 flex justify-center"
          >
            <input
              id="uploadCSV"
              type="file"
              title="Upload CSV or PDF"
              className="hidden"
              accept=".csv, .pdf"
              onChange={(e) => uploadFile(e)}
            />
            <FaPlus className="h-full w-full" />
          </label>
          <div className="h-full w-[20%] flex justify-center items-center">
            <RiGeminiFill className="h-full w-[18%] rounded-3xl" />
            <span className="pl-[5%] text-xs italic">Powered by Gemini</span>
          </div>
          {loading ? (
            <FaSpinner className="animate-spin h-full w-[5%] text-blue-400" />
          ) : (
            <SlArrowUpCircle
              className="h-full w-[5%] rounded-2xl hover:bg-blue-600 hover:cursor-pointer transition-all duration-200"
              onClick={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
