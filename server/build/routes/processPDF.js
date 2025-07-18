import express from "express";
import { mcpClient } from "../server.js";
// @ts-ignore
import { pdf } from "pdf-parse";
//MCP Client instance
const client = mcpClient || null;
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        //Validate MCP Client
        if (!client) {
            console.error("Failed passing MCP Client to PDF router");
            return res.status(400).json({
                error: "Failed passing MCP Client instance to processPDF router.",
            });
        }
        //Check that request has a buffer
        const pdfBuffer = req.body;
        if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
            console.error("Missing or invalid PDF buffer");
            return res.status(400).json({
                error: "Missing or invalid PDF buffer",
            });
        }
        //Extract text from PDF
        const data = await pdf(pdfBuffer);
        const extractedText = data.text;
        //Send to LLM
        const reply = await client.processQuery(`Here is a PDF file. Please use this information as context to create your presentation wireframe: \n\n${extractedText}`);
        res.json({ reply });
    }
    catch (error) {
        console.error("Error processing PDF to LLM: ", error);
        res.status(500).json({
            error: "Failed to process PDF to LLM",
        });
    }
});
export default router;
