import { GoogleGenAI, Content, mcpToTool, CallableTool } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline/promises";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not set");
}

export class MCPClient {
  private ai: GoogleGenAI;
  private clients: Client[] = [];
  private transports: StdioClientTransport[] = [];
  private tools: CallableTool[] = [];
  private messages: Content[] = [];

  constructor() {
    //Creates instance of LLM: Gemini
    this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  //Server Connection Management Function
  async connectToServer(serverScriptPath: string) {
    try {
      const client = new Client({ name: "mcp-client-cli", version: "1.0.0" });

      const isJs = serverScriptPath.endsWith(".js");
      const isPy = serverScriptPath.endsWith(".py");
      if (!isJs && !isPy) {
        throw new Error("Server script must be a .js or .py file");
      }

      const command = isPy
        ? process.platform === "win32"
          ? "python"
          : "python3"
        : process.execPath;

      //Initiates the stdio transport connection between the server and the client.
      const transport = new StdioClientTransport({
        command,
        args: [serverScriptPath],
      });

      await client.connect(transport);

      //Converts MCP client to a Gemini-compatible tool
      const tool = mcpToTool(client);

      this.tools.push(tool);
      this.clients.push(client);
      this.transports.push(transport);

      console.log(`Connected to server with tools...\n`);
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  /**
   * Process the user's queries and sends the query to the Gemini
   * @param {string} query The user query
   */
  async processQuery(query: string) {
    try {
      //Push user's message to chat history
      this.messages.push({
        role: "user",
        parts: [{ text: query }],
      });

      //Prompt the model and extract its response as text
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: this.messages,
        config: {
          tools: this.tools,
        },
      });
      const reply = response?.text ?? "";

      //Validate the model's response
      if (typeof reply !== "string" || reply.trim() == "") {
        console.error(
          `\nSorry, the LLM returned an empty or invalid reply. Please try again.\n${response.text}`
        );
        //If LLM response invalid, remove user query that caused error from message history and return.
        this.messages.pop();
        return;
      }

      //Push model's response to chat history
      this.messages.push({
        role: "model",
        parts: [{ text: reply }],
      });

      return reply;
    } catch (error) {
      console.error("Error in processQuery()", error);

      this.messages.push({
        role: "model",
        parts: [
          {
            text: `There was an error processing your request:\n${error}`,
          },
        ],
      });

      return `There was an error in processQuery():\n${error}`;
    }
  }

  /**
   * [Deprecated] This function creates a CLI interface that allows the user to
   * keep a conversing with the LLM.
   */
  // async chatLoop() {
  //   //Initiates std chat connection
  //   const rl = readline.createInterface({
  //     input: process.stdin,
  //     output: process.stdout,
  //   });

  //   //Create the CLI interface
  //   try {
  //     console.log("MCP Client Started!");

  //     while (true) {
  //       const message = await rl.question("\nQuery: ");
  //       if (message.toLowerCase() === "quit") {
  //         break;
  //       }

  //       const response = await this.processQuery(message);
  //       console.log("\n" + response);
  //     }
  //   } finally {
  //     rl.close();
  //   }
  // }

  /**
   * Closes all client sessions
   */
  async cleanup() {
    for (const client of this.clients) {
      await client.close();
    }
  }
}

/**
 * Main function that starts the client. We export this function to our Express
 * backend to use the functions in our MCP Client class. Returns an instance
 * of the MCP Client.
 */
export async function connectToMCP() {
  //Path to Google Slides MPC Server entry file
  const slidesMCPPath = path.resolve(
    __dirname,
    "../../GoogleSlidesMCPServer/build/index.js"
  );

  //This client setup allows for multiple MCP Servers to connect to it at once.
  //For now, we are only connecting to the Google Slides MCP Server.
  //const slidesMCPPath = process.argv[2];
  //const notionMCPPath = process.argv[3];

  //Initiate the MCP Client(s)
  const mcpClient = new MCPClient();
  try {
    //Connects the client to MCP Server
    console.error("\nMCP Ecosystem is booting up...");
    await mcpClient.connectToServer(slidesMCPPath);
    //await mcpClient.connectToServer(notionMCPPath);

    //Returns an instance of the MCP Client
    return mcpClient;
  } catch (error) {
    console.error(`\nFatal error in MCPClient connectToMCP(): \n${error}`);
  }

  await mcpClient.cleanup();
  process.exit(0);
}

//TESTING: Boots up MCPClient on run.
// connectToMCP().catch((error) => {
//   console.error("Could not engage server", error);
//   process.exit(0);
// });
