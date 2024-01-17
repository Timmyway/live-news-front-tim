const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Specify the file path
const filePath = path.join(__dirname, 'datas', 'users.json');
const couchDBUrl = 'http://timmyway@123456localhost:5984/livenews';

// Read the content of the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Send the entire JSON document to CouchDB
    axios
      .post(couchDBUrl, jsonData)
      .then((response) => {
        console.log('Document successfully added to CouchDB:', response.data);
      })
      .catch((error) => {
        console.error('Error adding document to CouchDB:', error);
      });

    // Now jsonData contains the parsed JSON content
  } catch (jsonError) {
    console.error('Error parsing JSON:', jsonError);
  }
});
