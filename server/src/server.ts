/**
 * ./server.js
 *
 * *The entrypoint for our whole application.* This express backend connects
 * all parts of our application together. This server does the following:
 *  - Serves React static pages at two endpoints (UX/UI)
 *  - Initializes and handles user+MCP interaction at /chat/processQuery
 */

import { Request, Response } from "express";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectToMCP, MCPClient } from "../../MCPClient/build/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3001;
const app = express();

//A reference to our MCP Client
export let mcpClient: MCPClient | null = null;

app.use(cors());

//Starts the MCP Server AND THEN engages routes
const startServer = async () => {
  try {
    //If an MCP client doesn't exist, initialize a new one
    if (!mcpClient) {
      console.log("New MCP Client engaged...");
      mcpClient = await connectToMCP();

      //Set up routes now that MCP Server was engaged
      const processCSVRouter = (await import("./routes/processCSV.js")).default;
      const processQueryRouter = (await import("./routes/processQuery.js"))
        .default;
      const processPDFRouter = (await import("./routes/processPDF.js")).default;

      // Endpoint middleware that sends PDF context to MCP Client
      app.use(
        "/processPDF",
        express.raw({ type: "application/pdf", limit: "50mb" }),
        processPDFRouter
      );

      app.use(express.json());

      // Endpoint middleware that engages the MCP client and handles user queries
      app.use("/processQuery", processQueryRouter);

      // Endpoint middleware that sends CSV context to MCP Client
      app.use("/processCSV", processCSVRouter);

      //Starts server at port
      app.listen(port, () => {
        console.log(`\nServer started at port: http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error("Failed to start MCP Client", error);
  }
};
startServer();

//Serves React static files from React build directory
app.use(express.static(path.join(__dirname, "../../clientFrontend/dist")));

//Serves React frontend to root endpoint
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../clientFrontend/dist/index.html"));
});
