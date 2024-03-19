const http = require("http");
const fs = require("fs");

// function to read data from JSON file
function readDataFromFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// function to write data to JSON file
function writeDataToFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// function to authenticate
// function authenticate(req, res, next) {
//   function findUser(username, password) {
//     const users = [
//       { username: "user1", password: "password1" },
//       { username: "user2", password: "password2" },
//       { username: "user3", password: "password3" },
//     ];

//     return users.find((user) => user.username === username);
//   }
//   const user = findUser("user1", "password1");
//   if (!user) {
//     res.statusCode(401);
//     res.end();
//     return user;
//   }
//   if (user.username !== "user1" || user.password !== "password1") {
//     res.statusCode = 401;
//     res.end();
//     return user;
//   }
// }

const server = http.createServer((req, res) => {
  const { method, url, headers } = req;

  const authHeader = headers["authorization"];
  let username, password;

  if (authHeader) {
    const authParts = authHeader.split(" ");
    if (authParts.length === 2 && authParts[0].toLowerCase() === "basic") {
      const credentials = Buffer.from(authParts[1], "base64")
        .toString()
        .split(":");
      username = credentials[0];
      password = credentials[1];
    }
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  // When request data is fully received
  req.on("end", () => {
    // books
    if (method === "GET" && url === "/books") {
      const response = {
        success: true,
        message: "GET /books endpoint reached successfully",
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } else if (method === "POST" && url.startsWith("/books")) {
      const response = {
        success: true,
        message: `POST ${url} endpoint reached successfully`,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } else if (method === "PUT" && url === "/books") {
      const response = {
        success: true,
        message: "PUT /books endpoint reached successfully",
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } else if (method === "PATCH" && url.startsWith("/books")) {
      const response = {
        success: true,
        message: `PATCH ${url} endpoint reached successfully`,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } else if (method === "DELETE" && url.startsWith("/books")) {
      const response = {
        success: true,
        message: `DELETE ${url} endpoint reached successfully`,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    }

    // authors
    else if (method === "GET" && url.startsWith("/books/authors")) {
      const response = {
        success: true,
        message: `GET ${url} endpoint reached successfully`,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } else if (method === "POST" && url.startsWith("/books/authors")) {
      const response = {
        success: true,
        message: `POST ${url} endpoint reached successfully`,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } else if (method === "PUT" && url.startsWith("/books/authors")) {
      const response = {
        success: true,
        message: `PUT ${url} endpoint reached successfully`,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } else if (method === "PATCH" && url.startsWith("/books/authors")) {
      const response = {
        success: true,
        message: `PATCH ${url} endpoint reached successfully`,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } else if (method === "DELETE" && url.startsWith("/books/authors")) {
      const response = {
        success: true,
        message: `DELETE ${url} endpoint reached successfully`,
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    }

    // Handle invalid routes
    else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Invalid route");
    }
  });
});

server.listen(8900, () => {
  console.log("Server now running on port 8900");
});
