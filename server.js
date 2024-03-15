const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, result) => {
    if (err) throw err;
    const data = JSON.parse(result);
    res.json(data);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: uuidv4()
  }
  
  console.log(newNote)
  fs.readFile('db/db.json', 'utf8', (err, result) => {
      const data = JSON.parse(result)
      data.push(newNote)
      fs.writeFile('db/db.json', JSON.stringify(data), (err) => {
          res.json(newNote)
      })
  })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});