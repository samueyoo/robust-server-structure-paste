const express = require("express");
const app = express();
const pastesRouter = require('./pastes/pastes.router');

// TODO: Follow instructions in the checkpoint to implement ths API.

const pastes = require('./data/pastes-data');

app.use(express.json());

app.use('/pastes', pastesRouter);

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = 'Something went wrong!' } = error; //Destructure the error that was passed by a next() function
  res.status(status).json({ error: message }); //Send the status the error object contained, along with the message in JSON format
});
//test

module.exports = app;
