/**
 * ./routes/sendToken.js
 *
 * This router sends the user's access token to the LLM in a
 * processQuery()
 */

import express from "express";
import { Request, Response } from "express";
import { mcpClient } from "../server.js";
import { storeAccessToken } from "../../../GoogleSlidesMCPServer/build/index.js";

//MCP Client instance
const client = mcpClient || null;

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    //Validate that MCP Client exists
    if (!client) {
      res.status(400).json({
        error: "Failed passing MCP Client instance to sendToken router",
      });
      return;
    }

    //@ts-ignore
    const token = req.session.accessToken;

    if (!token) {
      res.status(400).json({
        error: "Failed retrieving access Token from session. Does it exist?",
      });
    }

    const result = client.manualToolCall("set-access-token", {
      accessToken: token,
    });

    console.error("Access token sent to MCP server");
    res.status(200).send("Token sent succesfully");
  } catch (error) {
    console.error("Error in /sendToken router", error);
    res.status(500).json({ error: "Error in /sendToken router" });
  }
});

export default router;
