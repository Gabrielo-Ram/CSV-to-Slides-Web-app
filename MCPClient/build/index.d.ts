export declare class MCPClient {
    private ai;
    private clients;
    private transports;
    private tools;
    private messages;
    constructor();
    connectToServer(serverScriptPath: string): Promise<void>;
    /**
     * Process the user's queries and sends the query to the Gemini
     * @param {string} query The user query
     */
    processQuery(query: string): Promise<string | undefined>;
    manualToolCall(nameTool: string, args: Record<string, any>): Promise<void>;
    /**
     * [Deprecated] This function creates a CLI interface that allows the user to
     * keep a conversing with the LLM.
     */
    /**
     * Closes all client sessions
     */
    cleanup(): Promise<void>;
}
/**
 * Main function that starts the client. We export this function to our Express
 * backend to use the functions in our MCP Client class. Returns an instance
 * of the MCP Client.
 */
export declare function connectToMCP(): Promise<MCPClient>;
