const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.

const pastes = require('./data/pastes-data');

app.use(express.json());

function pastesHasPasteId(req, res, next) {
  const { pasteId } = req.params;
  const foundPaste = pastes.find(paste => paste.id === Number(pasteId));
  if (foundPaste) {
    next();
  } else {
    next({
      status: 404,
      message: `Paste id not found: ${pasteId}`,
    })
  }
}

app.get('/pastes/:pasteId', pastesHasPasteId, (req, res, next) => { //Added pasteId validation middleware
  const { pasteId } = req.params;
  const foundPaste = pastes.find(paste => paste.id === Number(pasteId));
  res.json({ data: foundPaste });
});

app.get('/pastes', (req, res) => {
  res.json({ data: pastes });
});

function bodyHasTextProperty(req, res, next) {
  const { data: { text }={} } = req.body;
  if (text) {
    return next(); //Call next() w/o an error message if text exists
  }
  next({ //We are now passing in next() an object containing a status and message property!
    status: 400,
    message: 'A "text" property is required.',
    }
  ); //Otherwise call next() and pass in an error message
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0); //Checks for the largest Id value currently in pastes

app.post('/pastes', bodyHasTextProperty, (req, res, next) => { //We've later added in the bodyHasTextProperty function as validation middleware to reduce the create-paste complexity
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body; //Destructures "data" since JSON always gets stapled under a "data" property, 
  // then destructures data, and if req.body is not providing a value for data, set it to an empty object

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
});

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
