const router = require('express').Router(); //Creates a new instance of Express router
const controller = require('./pastes.controller'); //Imports the /pastes controller we just created

router.route("/:pasteId").get(controller.read).put(controller.update).delete(controller.delete);

router.route('/').get(controller.list).post(controller.create);
//router.route('/'): using route() lets you write the path once, and then chain multiple route handlers to that path
//Right now we only have .get(), but later on, we'll add post() and all() to the method chain



module.exports = router;