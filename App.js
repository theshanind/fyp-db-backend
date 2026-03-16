const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();

app.use(cors());
app.use(express.json());

const dbconnect = require('./Config/databaseconnection'); // import DB connection

dbconnect();

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});