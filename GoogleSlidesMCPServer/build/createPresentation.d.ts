/**
 * 'createPresentation.ts' is a central hub for logic that creates a new Google
 * Slides presentation into the user's Google Drive.
 *
 * This file handles authorization and authentication of Google details and
 * it handles creating a new presentation and adding a 'Title' slide.
 *
 */
import { OAuth2Client } from "google-auth-library";
/**
 * Load client credentials to access the Google API.
 */
export declare function getOAuth2Client(): OAuth2Client;
export declare function createSlidesForUser(companyName: string, accessToken: string, companyData?: any): Promise<string>;
