const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();

app.use(cors());
app.use(express.json());

const dbconnect = require('./Config/DataBase'); // import DB connection
dbconnect();

const Routes = require("./Route/reg");
app.use('/api/auth', Routes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});