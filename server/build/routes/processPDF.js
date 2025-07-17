import express from "express";
import { mcpClient } from "../server.js";
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
//MCP Client instance
const client = mcpClient || null;
const router = express.Router();
router.post("/", async (req, res) => {
    try {
        //Validate MCP Client
        if (!client) {
            return res.status(400).json({
                error: "Failed passing MCP Client instance to processPDF router.",
            });
        }
        //Check that request has a buffer
        const pdfBuffer = req.body;
        if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
            return res.status(400).json({
                error: "Missing or invalid PDF buffer",
            });
        }
        //Parse PDF
        const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(pdfBuffer),
        });
        const pdfDoc = await loadingTask.promise;
        let extractedText = "";
        //Iterate through each page in the PDF and extract the text
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const content = await page.getTextContent();
            const strings = content.items.map((item) => item.str).join(" ");
            extractedText += strings + "\n";
        }
        //Send to LLM
        const reply = await client.processQuery(`Here is a PDF file. Please use this information as context to create your presentation wireframe: \n\n${extractedText}`);
        res.json({ reply });
    }
    catch (error) {
        console.error("error processing PDF to LLM: ", error);
        res.status(500).json({
            error: "Failed to process PDF to LLM",
        });
    }
});
export default router;
