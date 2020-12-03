const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  // console.log(req.url, req.method);
  res.setHeader("Content-Type", "text/html");
  // res.write("<h1>Hello, World!</h1>");
  // res.end();

  let path = "./views/";

  switch (req.url) {
    case "/":
      path += "index.html";
      res.statusCode = 200;
      break;
    case "/about":
      path += "about.html";
      res.statusCode = 200;
      break;
    case "/about-redirect":
      res.statusCode = 301;
      res.setHeader("Location", "./about");
      res.end();
      break;
    default:
      path += "404.html";
      res.statusCode = 404;
      break;
  }

  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.end(data);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
