const http = require("http");
const fs = require("fs");



// Function to read data from JSON file
function readDataFromFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Function to write data to JSON file
function writeDataToFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Authenticate user
function authenticateUser(headers) {
  const authHeader = headers["authorization"];
  if (!authHeader) return false;

  const authParts = authHeader.split(" ");
  if (authParts.length !== 2 || authParts[0].toLowerCase() !== "basic") return false;

  const [username, password] = Buffer.from(authParts[1], "base64").toString().split(":");
  const users = readDataFromFile('./data/users.json');
  const user = users.find(u => u.username === username && u.password === password);
  return !!user;
}

// Routes
const server = http.createServer((req, res) => {
  const { method, url, headers } = req;

  // Authenticate user
  if (!authenticateUser(headers)) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Unauthorized');
    return;
  }

  // Books endpoints
  if (method === 'GET' && url === '/books') {
    const books = readDataFromFile('./data/books.json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(books));
  } else if (method === 'PUT' && url === '/books') {
    // PUT endpoint for updating all books
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedBooks = JSON.parse(body);
      writeDataToFile('./data/books.json', updatedBooks);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedBooks));
    });
  } else if (method === 'PATCH' && url.startsWith('/books/')) {
    // PATCH endpoint for updating a specific book
    const bookId = url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedBookData = JSON.parse(body);
      const books = readDataFromFile('./data/books.json');
      if (books[bookId]) {
        books[bookId] = { ...books[bookId], ...updatedBookData };
        writeDataToFile('./data/books.json', books);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(books[bookId]));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Book not found');
      }
    });
  } else if (method === 'POST' && url === '/books') {
    // POST endpoint for creating a new book
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newBook = JSON.parse(body);
      const books = readDataFromFile('./data/books.json');
      books[newBook.id] = newBook;
      writeDataToFile('./data/books.json', books);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newBook));
    });
  } else if (method === 'DELETE' && url.startsWith('/books/')) {
    // DELETE endpoint for deleting a specific book
    const bookId = url.split('/')[2];
    const books = readDataFromFile('./data/books.json');
    if (books[bookId]) {
      delete books[bookId];
      writeDataToFile('./data/books.json', books);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Book with ID ${bookId} deleted`);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Book not found');
    }
  }

  // Authors endpoints
  else if (method === 'GET' && url === '/authors') {
    const authors = readDataFromFile('./data/authors.json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(authors));
  } else if (method === 'POST' && url === '/authors') {
    // POST endpoint for creating a new author
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newAuthor = JSON.parse(body);
      const authors = readDataFromFile('./data/authors.json');
      authors.push(newAuthor);
      writeDataToFile('./data/authors.json', authors);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newAuthor));
    }); 
  } else if (method === 'PUT' && url === '/authors') {
    // PUT endpoint for updating authors
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedAuthors = JSON.parse(body);
      writeDataToFile('./data/authors.json', updatedAuthors);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedAuthors));
    });
  } else if (method === 'PATCH' && url.startsWith('/authors')) {
    // PATCH endpoint for updating a specific author
    const authorId = url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedAuthorData = JSON.parse(body);
      const authors = readDataFromFile('./data/authors.json');
      const index = authors.findIndex(author => author.id === authorId);
      if (index !== -1) {
        authors[index] = { ...authors[index], ...updatedAuthorData };
        writeDataToFile('./data/authors.json', authors);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(authors[index]));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Author not found');
      }
    });
  } else if (method === 'DELETE' && url.startsWith('/authors')) {
    // DELETE endpoint for deleting a specific author
    const authorId = url.split('/')[2];
    const authors = readDataFromFile('./data/authors.json');
    const filteredAuthors = authors.filter(author => author.id !== authorId);
    if (filteredAuthors.length < authors.length) {
      writeDataToFile(`${DATA_FOLDER}/authors.json`, filteredAuthors);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Author with ID ${authorId} deleted`);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Author not found');
    }
  }

  // Handle invalid routes
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Invalid route');
  }
});

server.listen(8900, () => {
    console.log("Server now running on port 8900");
  }); 