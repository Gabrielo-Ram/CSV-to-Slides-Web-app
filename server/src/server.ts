import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToMCP, MCPClient } from "../../MCPClient/build/index.js";
import session from "express-session";
import passport from "passport";
import "./passport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}

const frontendURL = process.env.FRONTEND_URL;
if (!frontendURL) {
  throw new Error("Could not retrieve frontendURL from environment");
}

const port = 3001;
const app = express();

//A reference to our MCP Client
export let mcpClient: MCPClient | null = null;

//Lets express trust the Render proxy
app.set("trust proxy", 1);

//CORS config to enable frontend
app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  })
);

//Express-session config
app.use(
  session({
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "my-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, //Convert to 'false' if testing locally; 'true' if production
      httpOnly: true,
      sameSite: "none", //Change to "none" on production
      maxAge: 1000 * 60 * 60 * 1,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Starts the MCP Server AND THEN engages routes
const startServer = async () => {
  try {
    //If an MCP client doesn't exist, initialize a new one
    if (!mcpClient) {
      mcpClient = await connectToMCP();

      //Set up routes now that MCP Server is engaged
      const processCSVRouter = (await import("./routes/processCSV.js")).default;
      const processQueryRouter = (await import("./routes/processQuery.js"))
        .default;
      const processPDFRouter = (await import("./routes/processPDF.js")).default;
      const authRouter = (await import("./routes/authRouter.js")).default;
      const sendTokenRouter = (await import("./routes/sendToken.js")).default;

      //Mount routes to proper endpoints
      app.use(
        "/processPDF",
        express.raw({ type: "application/pdf", limit: "50mb" }),
        processPDFRouter
      );

      app.use(express.json());
      app.use("/processQuery", processQueryRouter);
      app.use("/processCSV", processCSVRouter);
      app.use("/sendToken", sendTokenRouter);
      app.use("/", authRouter);

      //Starts server at port
      app.listen(port, () => {
        console.error(`\nServer started at port: ${port} \n`);
      });
    }
  } catch (error) {
    console.error("Failed to start MCP Client", error);
  }
};

startServer();

//Checks if the user is signed-in or not.
app.get("/api/auth/user", (req: any, res: any) => {
  try {
    if (req.isAuthenticated() && req.user) {
      res.status(200).send("User authenticated!");
    }
  } catch (error) {
    console.error("Error in /api/auth/user:", error);
    res.status(401).send("Fatal error at /api/auth/user");
  }
});

//TESTING:
app.get("/api/session", (req: any, res: any) => {
  if (!req.session) {
    return res.send("req.session is empty or null");
  }
  res.json(req.session);
});
