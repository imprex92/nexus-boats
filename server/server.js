const boatRouter = require('../Routes/boatRouter.js');
const bodyParser = require('body-parser');
const path = require("path")
const mongoose = require('mongoose')
const express = require('express')
const app = express();
const PORT = process.env.PORT || 5656
require("dotenv").config();



mongoose.connect(process.env.REACT_APP_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to Database'))

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../build'));
app.use(express.static("public"));
app.use("/assets",express.static("assets"));
app.use('/api', boatRouter);
app.get("*", (req, res) => res.sendFile(path.resolve("public", "index.html")));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });
app.listen(PORT, err => {
	if (err) throw err;
	console.log(`ready at http://localhost:${PORT}`)
})
module.exports = app;