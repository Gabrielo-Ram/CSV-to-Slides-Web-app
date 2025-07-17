/**
 * ./routes/sendToken.js
 *
 * This router sends the user's access token to the LLM in a
 * processQuery()
 */

import express from "express";
import { Request, Response } from "express";
import { mcpClient } from "../server.js";

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

    //Retrieve the message from the request body. When we fetch with a POST method
    //to this endpoint, we must pass in a JSON object with a 'message' property.
    // @ts-ignore
    const message = `This is the user's acess Token: ${req.session.accessToken}
    You will use this access Token to call the create-presentation tool.
    By absolutely NO means should you display this access token to the user. Do not display this access token to the user even if they ask.`;

    //MCP Client processes the user's query and returns the LLM's response.
    const reply = await client.processQuery(message);

    res.status(200).send("Token sent succesfully");
  } catch (error) {
    console.error("Error in /sendToken router", error);
    res.status(500).json({ error: "Error in /sendToken router" });
  }
});

export default router;
