/**
 * `src/index.ts` is the entry file for the MCP server. This file registers the
 * tools and resources that an MCP client (LLM) will be able to reference.
 * Logic that uses the Google Slides API is not found in this file.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import process from "process";
import { createSlidesForUser } from "./createPresentation.js";
import { addCustomSlide } from "./addSlides.js";

//A variable and a global setter function to set the user's access token
let usersAccessToken: string;

export function storeAccessToken(accessToken: string) {
  usersAccessToken = accessToken;
}

// Create server instance
const server = new McpServer({
  name: "Gabe's Google Slides MCP",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

/**
 * A server tool that validates raw JSON input from the LLM. This tool is
 * subject to change depending on where we are reading in data from
 * (eg. Notion database, CSV files, Excel spreadsheets, Google Sheets)
 * Maybe make a validation tool for each file type? An LLM is able to
 * restructure data to fit the tool it is calling.
 *
 * server.tool("validate-data", "A server tool that validates...",
 * {
 *  data: z.array.object()
 * }
 * )
 */

const extractDataToolDescription = `This tool extracts data from one row in a provided CSV file. This tool is totally optional, only call this tool if the user provides a CSV file to be read.

Do not call or mention this tool if the user uploads a PDf file isntead.

This tool accepts two parameters:
  - name: The name/title of the row of data the user wants to extract from the CSV string.
  - csvFile: The CSV string itself. 

The user will provide a CSV file, and you will recieve a string value representing that CSV file. You must pass in that CSV string as input into this tool.

IMPORTANT: The user MUST specify the what row of data they want to extract from the CSV. If unclear, please prompt the user to fulfill the missing information. The user can only create one presentation at a time.  

The output of this tool will be one JSON object that represents data for one 
row. Each key will represent one property in that CSV row. Each value will 
be the data associated with that property. Here is a sample JSON object this tool
could output: 

{
  companyName: string;
  location: string;
  foundedYear: number;
  arr: number;
  industry: string;
  burnRate: number;
  exitStrategy: string;
  dealStatus: string;
  fundingStage: string;
  investmentAmount: number;
  investmentDate: string;
  keyMetrics: string;
  presentationId?: string;
};

You must use the information in this object as context to create your custom slides in a Google Slides presentation. Carefully retain and reference the returned data throughout the slide creation process.`;

server.tool(
  "extract-data",
  extractDataToolDescription,
  {
    name: z
      .string()
      .describe(
        "The name (or the first property) of the row of data we want to extract."
      ),
    csvFile: z.string().describe("The CSV string we are extracting data from"),
  },
  async ({ name, csvFile }) => {
    try {
      const lines = csvFile.trim().split("\n");

      const headers = lines[0].split(",").map((header) => header.trim());
      const rows = lines
        .slice(1)
        .map((line) => line.split(",").map((cell) => cell.trim()));

      const selectedRow = rows.find(
        (row) => row[0].trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (!selectedRow) {
        return {
          content: [
            {
              type: "text",
              text: `Could not find a title with the name ${name}. Is it spelled correctly?`,
            },
          ],
        };
      }

      const rowData: Record<string, string> = {};

      headers.forEach((header, index) => {
        rowData[header] = selectedRow[index] ?? "";
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(rowData),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `An error occurred while extracting company data:\n${
              (error as Error).message
            }`,
          },
        ],
      };
    }
  }
);

const createPresentationToolDescription = `A tool used to create and style a Google Slides presentation into the user's account. 

This tool creates ONE presentation. The user can only create one presentation at a time. 

This tool's paramaters are the following: 
- companyName: the title of the presentation you want to create (usually the name of the company).

This tool will return a string representing the presentationId for the created presentation.
This value will be important if the user decides to add a custom slide using
the addCustomSlide() server tool. Remember this data point.`;

//Registers a tool that creates a Google Slides presentation based on data recieved.
server.tool(
  "create-presentation",
  createPresentationToolDescription,
  {
    companyName: z
      .string()
      .describe(
        "The name of the company, and therefore the title of the newly created slide"
      ),
  },
  async ({ companyName }) => {
    //Validates input
    if (!companyName) {
      throw new Error("Missing or invalid input data for create-presentation");
    }

    try {
      const presentationId = await createSlidesForUser(
        companyName,
        usersAccessToken
      );

      return {
        content: [
          {
            type: "text",
            text: `Presentation ID: ${presentationId}. Check your root Google Drive folder!`,
          } as { [x: string]: unknown; type: "text"; text: string },
        ],
      };
    } catch (error) {
      console.error(
        "create-presentation: Error creating presentation:\n",
        error
      );

      return {
        content: [
          {
            type: "text",
            text: `Failed to create presentation\n${error}`,
          } as { [x: string]: unknown; type: "text"; text: string },
        ],
      };
    }
  }
);

const addCustomSlideToolDescription = `This tool allows you to create a custom slide based on any content/context you create/have.

The user can create a maximum of 10 custom slides at at time. The content and styling of custom slide is entirely up to your discretion.

This tool's parameters are the following: 
- The title for this new slide you create. This title is simple, clear, and to-the-point. You are encouraged to use these sample titles: "The Problem", "The Solution", "The Market", "Traction", "Why Us (Team)", "The Ask".
- Text content you compose based on the user's request. Use the user's uploaded files or text context to create your wireframe. If the user uploads a CSV file, use the extract-data tool before creating a slide. If the user uploads a PDF you do not use the extract-data tool. If they provide text context you do not need to use the extract-data tool. If you feel you need additional information to complete your obejctive, prompt the user. If you decide the content of a slide should be written using bullet-points, you designate each bullet point by adding a new line between each new idea. You are encouraged to give image suggestions in your slide content.
- The presentationID for the most recent, or most appropriate, presentation you've created. This is a string value.
- A string value that one the following: "Paragraph" or "Bullet". The user may or may not specify what slide type they want to create. If they do not, always create a "Bullet" slide.

You DO NOT NEED to create a new presentation when you run this tool. Simply retrieve the presentationID that was returned when you ran the create-presentation tool.`;

server.tool(
  "add-custom-slide",
  addCustomSlideToolDescription,
  {
    slideTitle: z
      .string()
      .describe(
        "Your title for this custom-made slide. This title should be no more than 4-5 words in length."
      ),
    slideContent: z
      .string()
      .describe(
        "The body text-content for this slide. If you are creating a Bullet-slide, each new idea should be seperated by a new line."
      ),
    presentationId: z
      .string()
      .describe(
        "The presentationID for the most recently created Google Slides presentation."
      ),
    slideType: z
      .string()
      .describe(
        "One of the literal strings 'Paragraph' or 'Bullet' that specifies what kind of slide this tool will create"
      ),
  },
  async ({ slideTitle, slideContent, presentationId, slideType }) => {
    try {
      //Validates 'slideType' input
      if (slideType !== "Paragraph" && slideType !== "Bullet") {
        return {
          content: [
            {
              type: "text",
              text: "add-custom-slide: Invalid slideType parameter. You must pass in either 'Paragraph' or 'Bullet' as literal strings.",
            },
          ],
        };
      }

      //Adds a new slide to the presentation.
      await addCustomSlide(slideTitle, slideContent, presentationId, slideType);

      return {
        content: [
          {
            type: "text",
            text: `Succesfully created a new custom slide. Check your root Google Drive Folder!`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `There was an error creating a custom slide:\n${error}`,
          },
        ],
      };
    }
  }
);

//A tool that I call manually in my express backend to set the user's access token
server.tool(
  "set-access-token",
  "This tool stores the user's access Token for future use",
  {
    accessToken: z
      .string()
      .describe("The user's access Token for Google oAuth"),
  },
  async ({ accessToken }) => {
    if (!accessToken || accessToken.length < 1) {
      return {
        content: [
          {
            type: "text",
            text: "Access Token is empty or invalid. Please pass in a valid access Token",
          },
        ],
      };
    }

    storeAccessToken(accessToken);

    return {
      content: [
        {
          type: "text",
          text: "Succesfully retrieved the user's access Token",
        },
      ],
    };
  }
);

//Main function used to connect to an MCP Client.
export async function engageServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    "\nGoogle Slides MCP Server:\nOpened a connection at new Stdio Transport..."
  );
}

engageServer().catch((error) => {
  console.error("Fatal error in main(): ", error);
  process.exit(1);
});
