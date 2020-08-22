const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

// get all users and create user
router
    .route("/")
    .get(userController.getUsers)
    .post(userController.createUser);

// RUD user
router
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
