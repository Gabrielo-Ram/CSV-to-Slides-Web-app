/**
 * 'global.ts' is a dedicated module that contains global variables that are used across
 * this application such as:
 *  - The current presentation ID
 *  - The Authorization token
 */
import { slides_v1 } from "googleapis";
export declare let presentationID: string | null;
export declare function setPresentationID(newID: string): void;
export declare let auth: slides_v1.Slides | null;
export declare function setAuthToken(token: slides_v1.Slides): void;
