const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.

const pastes = require('./data/pastes-data');

app.use(express.json());

app.get('/pastes/:pasteId', (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find(paste => paste.id === Number(pasteId));
  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});

app.get('/pastes', (req, res) => {
  res.json({ data: pastes });
});

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0); //Checks for the largest Id value currently in pastes

app.post('/pastes', (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body; //Destructures "data" since JSON always gets stapled under a "data" property, 
  // then destructures data, and if req.body is not providing a value for data, set it to an empty object
  if (text) {
    const newPaste = {
      id: ++lastPasteId,
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
  } else {
    res.sendStatus(400);
  }

});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});
//test

module.exports = app;
