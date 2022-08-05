const pastes = require("../data/pastes-data");

function list(req, res) {
  res.json({ data: pastes });
}

function pasteExists(req, res, next) {
    const { pasteId } = req.params;
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    if (foundPaste) {
      return next();
    }
    next({
      status: 404,
      message: `Paste id not found: ${pasteId}`,
    });
}

function read(req, res) {
const { pasteId } = req.params;
console.log(pasteId);
const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
res.json({ data: foundPaste });
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0); //Checks for the largest Id value currently in pastes

function create(req, res, next) {
  //We've later added in the bodyHasTextProperty function as validation middleware to reduce the create-paste complexity
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
    req.body; //Destructures "data" since JSON always gets stapled under a "data" property,
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
}

function update(req, res) {
    const { pasteId } = req.params;
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
    const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
    // Update the paste
    foundPaste.name = name;
    foundPaste.syntax = syntax;
    foundPaste.expiration = expiration;
    foundPaste.exposure = exposure;
    foundPaste.text = text;
  
    res.json({ data: foundPaste });
}

function destroy(req, res) {
    const { pasteId } = req.params;
    const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
    // `splice()` returns an array of the deleted elements, even if it is one element
    const deletedPastes = pastes.splice(index, 1);
    res.sendStatus(204);
}

function exposurePropertyIsValid(req, res, next) {
  const { data: { exposure } = {} } = req.body;

  const validExposure = ["private", "public"];

  if (validExposure.includes(exposure)) {
    return next();
  }

  next({
    status: 400,

    message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
  });
}

function syntaxPropertyIsValid(req, res, next) {
  const { data: { syntax } = {} } = req.body;

  const validSyntax = [
    "None",
    "Javascript",
    "Python",
    "Ruby",
    "Perl",
    "C",
    "Scheme",
  ];

  if (validSyntax.includes(syntax)) {
    return next();
  }

  next({
    status: 400,

    message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
  });
}

function expirationIsValidNumber(req, res, next) {
  const { data: { expiration } = {} } = req.body;

  if (expiration <= 0 || !Number.isInteger(expiration)) {
    return next({
      status: 400,

      message: `Expiration requires a valid number`,
    });
  }

  next();
}

module.exports = {
  list,
  create: [
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    create
  ],
  read: [pasteExists, read],
  update: [
    pasteExists,
    bodyDataHas('name'),
    bodyDataHas('syntax'),
    bodyDataHas('exposure'),
    bodyDataHas('expiration'),
    bodyDataHas('text'),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    update
  ],
  delete: [pasteExists, destroy],
};
