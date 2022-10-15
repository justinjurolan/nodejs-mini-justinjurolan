const { validationResult } = require("express-validator");

const User = require("../models/userList");

exports.getAddUser = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add User",
    path: "/admin/add-users",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddUser = (req, res, next) => {
  const name = req.body.name;
  const age = req.body.age;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add User",
      path: "/admin/add-users",
      editing: false,
      hasError: true,
      user: {
        name: name,
        age: age,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const user = new User({
    name: name,
    age: age,
  });

  user
    .save()
    .then((result) => {
      console.log("Creted User");
      res.redirect("/admin/users");
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditUser = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  User.findById(prodId)
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit User",
        path: "/admin/edit-product",
        editing: editMode,
        product: user,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditUser = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedName = req.body.name;
  const updatedAge = req.body.age;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add User",
      path: "/admin/add-users",
      editing: false,
      hasError: true,
      user: {
        name: updatedName,
        age: updatedAge,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  User.findById(prodId)
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }

      user.name = updatedName;
      user.age = updatedAge;
      return user.save();
    })
    .then((result) => {
      console.log("UPDATED USER!");
      res.redirect("/admin/users");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      console.log(users);
      res.render("admin/products", {
        prods: users,
        pageTitle: "Admin",
        path: "/admin/users",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteUser = (req, res, next) => {
  const prodId = req.body.productId;

  User.deleteOne({ _id: prodId })
    .then(() => {
      console.log("REMOVED USER");
      res.redirect("/admin/users");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
