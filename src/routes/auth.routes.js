const express = require("express");
const authController = require("../controllers/auth.controllers");

const router = express.Router();

// POST request : /api/auth/register ko control krega
router.post("/register", authController.userRegisterController);

// POST request : /api/auth/login ko control krega
router.post("/login", authController.userLoginController);

module.exports = router;
