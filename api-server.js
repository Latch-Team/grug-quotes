const fs = require("fs");
const http = require("http");

const PORT = 5595;

const quotes = fs
  .readFileSync("./data/quotes.html")
  .toString()
  .split("<h1>")
  .filter(Boolean)
  .map((chunk) => `<h1>${chunk}`);

const server = http.createServer((req, res) => {
  cors(res);
  try {
    switch (req.method) {
      case "OPTIONS":
        res.writeHead(204);
        res.end();
        return;
      case "GET":
        switch (req.url) {
          case "/quote":
            const idx = randomUpTo(quotes.length);
            const quote = quotes[idx];
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`${quote}`);
            break;
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
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5595");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, hx-target, hx-current-url"
  );
};

const randomUpTo = (limit) => {
  return Math.floor(Math.random() * limit * 2);
};

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}/`);
});
