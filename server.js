const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = parseInt(process.env.PORT ?? "4567");

const quotes = fs
  .readFileSync("./data/quotes.html")
  .toString()
  .split("<h1>")
  .filter(Boolean)
  .map((chunk) => `<h1>${chunk}`);

const server = http.createServer((req, res) => {
  try {
    switch (req.method) {
      case "GET":
        switch (req.url) {
          case "/":
          case "/index.html":
            serveFile("./index.html", res);
            break;
          case "/quote":
            const idx = Math.floor(Math.random() * quotes.length);
            const quote = quotes[idx];
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(quote);
            break;
          case "/assets/grug.png":
            serveFile("./assets/grug.png", res);
            break;
          case "/assets/over-time.png":
            serveFile("./assets/over-time.png", res);
            break;
          default:
            res.writeHead(404);
            res.end("Not found");
        }
        break;
      default:
        res.writeHead(405);
        res.end("Method not allowed");
    }
  } catch (err) {
    console.error("error", err);
    res.end();
  }
});

function serveFile(filePath, res) {
  let file;
  try {
    file = fs.readFileSync(filePath);
  } catch (err) {
    console.log("serveFile error", err);
    res.writeHead(500);
    res.end(`Server Error: ${err.code}`);
    return;
  }
  const ext = path.extname(filePath);
  const MIME_TYPES = {
    ".html": "text/html",
    ".png": "image/png",
  };
  res.writeHead(200, { "Content-Type": MIME_TYPES[ext] });
  res.end(file);
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
