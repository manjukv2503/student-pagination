const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Serve the HTML file
app.get('/', (req, res) => {
  fs.readFile('app.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(data);
    }
  });
});

// API endpoint to load student details in a paginated manner
app.get('/students', (req, res) => {
  const { page, size } = req.query;
  const pageSize = parseInt(size) || 10;
  const currentPage = parseInt(page) || 1;

  fs.readFile('student.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const students = JSON.parse(data);
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedStudents = students.slice(startIndex, endIndex);
      res.json(paginatedStudents);
    }
  });
});

// API endpoint for server-side filtering based on grade
app.get('/students/filter', (req, res) => {
  const { grade } = req.query;

  fs.readFile('student.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const students = JSON.parse(data);
      const filteredStudents = students.filter(student => student.grade === grade);
      res.json(filteredStudents);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});