const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../util/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/users", shopController.getUsers);

router.get("/users/list", isAuth, shopController.getUsersPDF);

module.exports = router;
