// ***** THIS IS MEANT TO RUN ON A LOCAL SERVER AND USED FOR PERSONAL USE ******

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// when this file is required, it will start the cron job. Nothing else is required.
const cronScan = require('./cronJob.js')

const port = 8000
app.set('port', port);
app.listen(app.get('port'), function() {
  console.log('Listening on port: ', port)
});

app.use(bodyParser.json()); // allows you to retrieve data from the body of requests made to this server
app.use(cors()); // sets up the headers to allow cross origin requests

app.get('/', function(req, res) {
	// this block will execute every time someone successfully navigates to the homepage if
	// you have a homepage set up.
	res.status(200)
	res.end()
})
