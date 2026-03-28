const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();

app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: '20mb' }));      // ← increase limit for base64 images
app.use(express.urlencoded({ limit: '20mb', extended: true }));


const dbconnect = require('./Config/DataBase'); // import DB connection
dbconnect();

const Routes = require("./Route/reg");
const LoginRoutes = require("./Route/login")
const HistoryRoutes = require('./Route/history');
const PriceRoutes   = require('./Route/price');     

app.use('/api/auth', Routes);
app.use('/api/auth', LoginRoutes);
app.use('/api/history', HistoryRoutes);
app.use('/api/price',   PriceRoutes);    


app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});