// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function (app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function (req, res) {
    res.render("index");
  });

  // route loads login.html
  app.get("/login", function (req, res) {
    res.render("login");
  });

   // route loads signup.html
   app.get("/signup", function (req, res) {
    res.render("signup");
  });


};
