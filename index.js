var http = require("http");
var hostName = "127.0.0.1";
var port = 8080;

const server = http.createServer(function (request, response) {
  const path = request.url;
  const method = request.method;

  if (path === "/products") {
    if (method === "GET") {
      response.writeHead(200, { "Content-Type": "application/json" });

      const products = JSON.stringify([
        {
          name: "농구공",
          price: 5000,
        },
      ]);

      response.end(products);
    } else if (method === "POST") {
      response.end("생성되었습니다!");
    }
  }
});

server.listen(port, hostName);

console.log("grab market server start!");
