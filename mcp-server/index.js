const path = require("path");
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "../database/database.sqlite");
const db = new sqlite3.Database(dbPath);

const server = new Server(
  {
    name: "cinemap-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_films",
        description: "List all films in the CineMap database",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_locations_for_film",
        description: "Get all film locations for a specific film",
        inputSchema: {
          type: "object",
          properties: {
            film_id: {
              type: "number",
              description: "The ID of the film",
            },
          },
          required: ["film_id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "list_films": {
      return new Promise((resolve, reject) => {
        db.all("SELECT id, title, release_year FROM films", [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
            });
          }
        });
      });
    }
    case "get_locations_for_film": {
      const film_id = request.params.arguments.film_id;

      return new Promise((resolve, reject) => {
        db.all(
          "SELECT id, name, city, country, description, upvotes_count FROM locations WHERE film_id = ?",
          [film_id],
          (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
              });
            }
          }
        );
      });
    }
    default:
      throw new Error("Unknown tool");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CineMap MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
