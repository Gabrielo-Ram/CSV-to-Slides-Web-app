/**
 * `src/index.ts` is the entry file for the MCP server. This file registers the
 * tools and resources that an MCP client (LLM) will be able to reference.
 * Logic that uses the Google Slides API is not found in this file.
 */
export declare function storeAccessToken(accessToken: string): Promise<void>;
export declare function engageServer(): Promise<void>;
