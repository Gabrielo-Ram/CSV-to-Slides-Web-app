/**
 * ./routes/processCSV.js
 *
 * This router sends a CSV file (provided by the user) to the LLM as context
 * for further processing.
 */

import express from "express";
import { mcpClient } from "../server.js";

//MCP Client instance
const client = mcpClient || null;

const router = express.Router();

router.post("/", async (req: any, res: any) => {
  try {
    //Validate that MCP Client exists
    if (!client) {
      res.status(400).json({
        error: "Failed passing MCP Client instance to processQuery router",
      });
      return;
    }

    const { csv } = req.body;
    if (!csv || typeof csv !== "string") {
      return res.status(400).json({
        error: "Missing or invalid CSV",
      });
    }

    //Give CSV file to MCPClient as context
    const reply = await client.processQuery(
      `Here is a CSV file. This is the CSV file you will pass into extract-company data. \n\n${csv}`
    );

    res.json({ reply });
  } catch (error) {
    console.error("Error processing CSV to LLM:", error);
    res.status(500).json({
      error: "Failed to process CSV to LLM",
    });
  }
});

export default router;
