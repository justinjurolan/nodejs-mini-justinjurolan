const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const { validateToken } = require("../util/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/users", validateToken, shopController.getUsers);

router.get("/users/list", shopController.getUsersPDF);

module.exports = router;
