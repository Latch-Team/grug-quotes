const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = parseInt(process.env.PORT ?? "4567");

const server = http.createServer((req, res) => {
  try {
    switch (req.method) {
      case "GET":
        switch (req.url) {
          case "/":
          case "/index.html":
            serveFile("./index.html", res);
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
  console.log(`Static server running at http://localhost:${PORT}/ - open this in your browser!`);
});
