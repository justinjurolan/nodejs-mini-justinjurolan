const path = require("path");

const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../util/is-auth");

const router = express.Router();

// /admin/add-user => GET
router.get("/add-users", isAuth, adminController.getAddUser);

// /admin/users => GET
router.get("/users", isAuth, adminController.getUsers);

// /admin/add-user => POST
router.post(
  "/add-users",
  [body("name").isString().trim(), body("age").isInt().trim()],
  isAuth,
  adminController.postAddUser
);

router.get("/edit-product/:productId", isAuth, adminController.getEditUser);

router.post(
  "/edit-product",
  [body("name").isString().trim(), body("age").isInt().trim()],
  isAuth,
  adminController.postEditUser
);

router.post("/delete-product", isAuth, adminController.postDeleteUser);

module.exports = router;
