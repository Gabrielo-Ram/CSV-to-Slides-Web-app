# Pitch-Deck Generator Web App

A full-stack web application that generates Google Slides presentations from CSV or PDF data using a custom Model Context Protocol (MCP) server and Google Slides API.

## Features

- **Frontend**: React + Vite app for user interaction and file upload.
- **Backend**: Node.js/Express server for authentication, session management, and routing.
- **MCP Server**: Custom Google Slides MCP server (as an npm package) to process data and generate presentations.
- **Authentication**: Google OAuth with session storage.
- **File Support**: Upload CSV or PDF files to generate pitch decks.
- **AI Integration**: Uses Gemini LLM for pitch deck content generation and structuring.

## Project Structure

```
CSV-to-Slides-Web-app/
│
├── clientFrontend/      # React frontend (Vite, TailwindCSS)
├── server/              # Express backend (TypeScript)
├── MCPClient/           # MCP client logic (TypeScript)
├── GoogleSlidesMCP/     # Custom MCP server (Google Slides logic)
└── README.md
```

## Getting Started

1. Install dependencies

From the project root, run:
```
cd server && npm install
cd ../clientFrontend && npm install
cd ../MCPClient && npm install
cd ../GoogleSlidesMCP && npm install
```

2. Environment Variables

- Set up `.env` files in the appropriate directories (see code for required variables like `SESSION_SECRET`, `GEMINI_API_KEY`, etc).

3. Build and Run

**Backend:**
`cd server
npm run build
npm start `

**Frontend:**
`cd clientFrontend
npm run dev'

4. Usage

- Visit `http://localhost:5173` to use the app.
- Authenticate with Google, upload your CSV or PDF, and generate a pitch deck.

## License

MIT

---

This app is live at this link:
[ Insert Link ]
