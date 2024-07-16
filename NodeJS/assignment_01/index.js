import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const server = http.createServer((req, res) => {
  let { url } = req;

  let filePath;
  const lastDotIndex = url.lastIndexOf(".");
  const hasExtension = Boolean(lastDotIndex > 0);
  const memType = {
    ".html": "text/html",
    ".css": "text/css",
    ".jpg": "image/jpg",
    ".png": "image/png",
    ".js": "text/javascript",
    "ico": "image/x-icon"
  }[url.substring(lastDotIndex)];

  res.setHeader("Content-Type", memType || "text/html");

  if (url === "/") {
    filePath = path.join(__dirname, 'public','index.html');
  } else {
    filePath = path.join(__dirname, 'public', url);
    if(!hasExtension) filePath += '.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      content = fs.readFileSync('./public/404.html');
      res.statusCode = 404;
      res.end(content);
    }

    res.statusCode = 200;
    res.end(data);
  });
});

server.listen(3000, "localhost", () => {
  console.log("server is listening on port 3000");
});
