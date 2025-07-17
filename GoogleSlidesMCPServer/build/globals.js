/**
 * 'global.ts' is a dedicated module that contains global variables that are used across
 * this application such as:
 *  - The current presentation ID
 *  - The Authorization token
 */
export let presentationID = null;
export function setPresentationID(newID) {
    presentationID = newID;
}
export let auth = null;
export function setAuthToken(token) {
    auth = token;
}
