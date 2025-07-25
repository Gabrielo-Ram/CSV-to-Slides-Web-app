import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectToMCP } from "../../MCPClient/build/index.js";
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
export let mcpClient = null;
//Lets express trust the Render proxy
app.set("trust proxy", 1);
//CORS config to enable frontend
app.use(cors({
    origin: frontendURL,
    credentials: true,
}));
//Throw error if session secret is not provided
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("Could not retrieve SESSION_SECRET from environment");
}
//Express-session 'cookie' config
app.use(session({
    name: "connect.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 1, // 1 hour
    },
}));
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
            app.use("/processPDF", express.raw({ type: "application/pdf", limit: "50mb" }), processPDFRouter);
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
    }
    catch (error) {
        console.error("Failed to start MCP Client", error);
    }
};
startServer();
//Checks if the user is signed-in or not.
app.get("/api/auth/user", (req, res) => {
    try {
        //Check for session
        if (!req.session) {
            return res
                .status(401)
                .send("Session is missing. User is not authenticated.");
        }
        //Check for access token
        if (!req.session.accessToken) {
            return res
                .status(401)
                .send("Access token not found in session. Log in may have failed");
        }
        return res.status(200).send("User is authenticated");
    }
    catch (error) {
        console.error("Fatal error in /api/auth/user: ", error);
        return res.status(500).send("Internal server error in /api/auth/user");
    }
});
//TESTING:
app.get("/api/session", (req, res) => {
    if (!req.session) {
        return res.send("req.session is empty or null");
    }
    res.json(req.session);
});
