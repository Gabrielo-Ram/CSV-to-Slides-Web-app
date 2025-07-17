/**
 * 'createPresentation.ts' is a central hub for logic that creates a new Google
 * Slides presentation into the user's Google Drive.
 *
 * This file handles authorization and authentication of Google details and
 * it handles creating a new presentation and adding a 'Title' slide.
 *
 */

import {
  presentationID,
  auth,
  setPresentationID,
  setAuthToken,
} from "./globals.js";
import { google, slides_v1 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { authenticate } from "@google-cloud/local-auth";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ["https://www.googleapis.com/auth/presentations"];
const CREDENTIALS_PATH = path.resolve("./secrets/credentials.json");
const TOKEN_PATH = path.resolve("./secrets/token.json");

/**
 * Load client credentials to access the Google API.
 */
export function getOAuth2Client(): OAuth2Client {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

/* ----———————————————————————————————————————————————--- */
// Logic for creating and a Google Slides Presentations

/**
 * Creates a Google Slide presentation and edits the 'Title' slide to
 * contain the company name and date the presentation was created.
 * @param {string} companyName The name of the company.
 * @param {slides_v1.Slides} service The Google Slides API instance.
 * @returns A presentationId string.
 */
async function createPresentation(
  companyName: string,
  service: slides_v1.Slides
) {
  //Creates the presentation and adds the Company name and current date into the title
  try {
    const presentation = await service.presentations.create({
      requestBody: {
        title: `${companyName} Slide Deck`,
      },
    });

    //Gets the presentationId and sets it to the global variable
    const presentationId = presentation.data.presentationId;
    if (!presentationId) {
      throw new Error("presentationId is null or undefined");
    }
    setPresentationID(presentationId);

    //Gets a reference to the 'Title Slide'
    const slideData = await service.presentations.get({
      presentationId,
    });
    const firstSlide = slideData.data.slides?.[0];

    if (!firstSlide) {
      throw new Error("No slides found");
    }
    if (!firstSlide.pageElements || firstSlide.pageElements.length === 0) {
      throw new Error("No elements found on First Slide");
    }

    //Get the objectIDs of the two automatically generated textboxes.
    const titleId = firstSlide.pageElements[0].objectId;
    const subtitleId = firstSlide.pageElements[1].objectId;
    if (!subtitleId || !titleId) {
      throw new Error("titleID or subtitleId not set");
    }

    //Replace the text inside each textbox with the company name and subheader respectively
    await service.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests: [
          {
            insertText: {
              objectId: titleId,
              text: companyName,
              insertionIndex: 0,
            },
          },
          {
            insertText: {
              objectId: subtitleId,
              text: `Created: ${new Date().toISOString().split("T")[0]}`,
              insertionIndex: 0,
            },
          },
        ],
      },
    });

    return presentationId;
  } catch (err) {
    throw new Error(
      `createPresentation(): Could not create presentation ${err}`
    );
  }
}

//Creates OAuth client to pass into initiateSlides()
export async function createSlidesForUser(
  companyName: string,
  accessToken: string,
  companyData?: any
) {
  if (!accessToken || typeof accessToken !== "string") {
    throw new Error("Invalid or missing access token in createSlidesForUser()");
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  oAuth2Client.setCredentials({ access_token: accessToken });

  return await initiateSlides(companyName, oAuth2Client, companyData);
}

/**
 * Initiates the creation of an entire Pitch Deck.
 * Includes a 'Title' slide and any supplemental slides thereafter.
 *
 * @param {any} companyData The object containing raw data for the company.
 * @param {string} companyName The name of the company you want to create a presentation for.
 */
async function initiateSlides(
  companyName: string,
  auth: OAuth2Client,
  companyData?: object
) {
  try {
    //Creates and sets authorization token
    const service = google.slides({ version: "v1", auth });
    setAuthToken(service);

    //Creates a new presentation and updates 'Title' slide
    const newPresentationId = await createPresentation(companyName, service);
    // companyData.presentationId = newPresentationId;
    setPresentationID(newPresentationId);

    if (!newPresentationId || !presentationID) {
      throw new Error("Failed to create presentation in initiateSlides()");
    }

    /*
    —————————————————————————————————————————————————————————————————————————————
      Add some pre-set slides below this line. Comment out this code-block if
      you don't want to add pre set slides. 
    */

    //Adds a new Bullet Slide
    // const preSetBulletTitle = "[Insert pre-set title]";
    // const preSetBulletContent =
    //   "[Insert pre-set content]\nThis is sample bullet content";
    // await addCustomSlide(
    //   preSetBulletTitle,
    //   preSetBulletContent,
    //   presentationID,
    //   "Bullet"
    // );

    // //Formats data and creates a 'Paragraph' slide
    // const preSetParagraphTitle = "[Insert pre-set title]";
    // const preSetParagraphContent =
    //   "[Insert pre-set content]\nThis is sample paragraph content";
    // await addCustomSlide(
    //   preSetParagraphTitle,
    //   preSetParagraphContent,
    //   presentationID,
    //   "Bullet"
    // );

    console.error(`\nCreated presentation with ID: ${newPresentationId}`);
    return newPresentationId;
  } catch (error) {
    throw new Error(`There was an error in initiateSlides(): \n${error}`);
  }
}

//TESTING: Main function used for testing
async function main() {
  try {
    const testData = {
      companyName: "Hax @ Newark",
      location: "Newark NJ",
      foundedYear: 2011,
      arr: 20000000,
      industry: "Venture Capital",
      burnRate: 8000000,
      exitStrategy: "IPO",
      dealStatus: "Due Diligence",
      fundingStage: "Series C",
      investmentAmount: 200,
      investmentDate: "May 10, 2024",
      keyMetrics:
        "This is a really really cool company with really really cool people. Let's see how long I can make this test string to test how Google Slides handles text wrap. My name is Gabe Ramirez, an intern at Hax. I love music (I play guitar and dance), and honestly forgot how much I enjoyed coding and problem solving until this project.",
    };

    //await initiateSlides("Hax @ Newark", testData);
  } catch (error) {
    console.error("\nThere was an error in the main function!\n", error);
  }
}

//main();
