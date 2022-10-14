const fs = require("fs");
const path = require("path");
const User = require("../models/userList");

const PDFDoc = require("pdfkit-table");

const ITEMS_PER_PAGE = 1;

exports.getUsers = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  User.find()
    .countDocuments()
    .then((numUsers) => {
      totalItems = numUsers;
      return User.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((users) => {
      res.render("shop/product-list", {
        prods: users,
        pageTitle: "Active Users",
        path: "/users",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getUser = (req, res, next) => {
  const prodId = req.params.productId;

  User.findById(prodId)
    .then((users) => {
      res.render("shop/product-detail", {
        product: users,
        pageTitle: product.name,
        path: "/users",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  User.find()
    .countDocuments()
    .then((numUsers) => {
      totalItems = numUsers;
      return User.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((users) => {
      res.render("shop/index", {
        prods: users,
        pageTitle: "List of Users",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getUsersPDF = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      return next(new Error("No user found!"));
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="user-list.pdf"');

    const userPath = path.join(__dirname, "../data/user-list.pdf");
    const pdfDoc = new PDFDoc();

    pdfDoc.pipe(fs.createWriteStream(userPath));
    pdfDoc.pipe(res);

    const tableData = {
      title: "User List",
      subtile: "List of all registered users",
      headers: ["Name", "Age"],
      rows: users.map((user) => [user.name, user.age]),
    };

    await pdfDoc.table(tableData, {
      columnsSize: [100, 100, 100, 100],
    });

    pdfDoc.end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
