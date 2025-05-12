const http = require("http");
const { Pool } = require("pg");

const PORT = 5595;

const db = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  user: process.env.POSTGRES_USER || "postgres",
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const server = http.createServer(async (req, res) => {
  cors(res);
  try {
    switch (req.method) {
      case "OPTIONS":
        res.writeHead(204);
        res.end();
        return;
      case "GET":
        switch (req.url) {
          case "/quote": {
            const quote = await getRandomQuote();
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`${quote}`);
            break;
          }
          default:
            res.writeHead(404);
            res.end("Not found");
        }
        return;
      default:
        res.writeHead(405);
        res.end("Method not allowed");
    }
  } catch (err) {
    console.error("error", err);
    res.end();
  }
});

const cors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4567");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, hx-target, hx-current-url, hx-request"
  );
};

const getRandomQuote = async () => {
  const idRes = await db.query(
    "SELECT id FROM quotes ORDER BY RANDOM() LIMIT 1"
  );
  const id = idRes.rows[0].id;
  // const idRes = await db.query("SELECT max(id) from quotes");
  // const maxId = idRes.rows[0].max;
  // const id = randomUpTo(maxId) + 1;
  const quote = await db.query("SELECT body_html FROM quotes WHERE id=$1", [
    id,
  ]);
  return quote.rows[0].body_html;
};

const randomUpTo = (limit) => {
  return Math.floor(Math.random() * limit);
};

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}/`);
});
