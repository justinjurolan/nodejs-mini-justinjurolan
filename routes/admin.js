const path = require("path");

const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const { validateToken } = require("../util/is-auth");

const router = express.Router();

// /admin/add-user => GET
router.get("/add-users", validateToken, adminController.getAddUser);

// /admin/users => GET
router.get("/users", validateToken, adminController.getUsers);

// /admin/add-user => POST
router.post(
  "/add-users",
  [body("name").isString().trim(), body("age").isInt().trim()],
  validateToken,
  adminController.postAddUser
);

router.get(
  "/edit-product/:productId",
  validateToken,
  adminController.getEditUser
);

router.post(
  "/edit-product",
  [body("name").isString().trim(), body("age").isInt().trim()],
  validateToken,
  adminController.postEditUser
);

router.post("/delete-product", validateToken, adminController.postDeleteUser);

module.exports = router;
