// npm Modules
var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var cheerio = require("cheerio");

//Contect to the module
// var contact = require('../models/contact');
var User = require("../models/user");
var Order = require("../models/order");
var Meal = require("../models/meal");
var Product = require("../models/productModel");
var OrderMeal = require("../models/orderMeal");

// Post is Sign up
router
  .route("/user")
  .post(function(req, res) {
    var user = new User();
    user.Email = req.body.Email;
    user.Password = req.body.Password;
    user.Admin = false;
    // checks if you already have a user like this on the database
    User.find(
      {
        Email: req.body.Email
      },
      function(err, users) {
        if (err) {
          console.log(err);
        }
        // if exist of the database or not
        if (users.length != 0) {
          res.redirect("/signUp.html?q=Email%20is%20already%20in%20use");
        } else {
          user.save(function(err) {
            if (err) {
              console.log(err);
            }
            res.redirect("/index.html?userEmail=" + req.query.Email);
          });
        }
      }
    );
  })

  // Get to use signIn
  .get(function(req, res) {
    User.find(
      {
        Email: req.query.Email,
        Password: req.query.Password
      },
      function(err, user) {
        if (err) {
          console.log(err);
        }
        if (user.length != 0) {
          if (user[0].Admin) {
            res.redirect("/admin.html?userEmail=" + req.query.Email);
          } else {
            res.redirect("/index.html?userEmail=" + req.query.Email);
          }
        } else {
          res.sendFile(path.join(__dirname, "../www", "signUp.html"));
        }
      }
    );
  });

// order table
router
  .route("/Order")
  .post(function(req, res) {
    var order = new Order();
    order.Name = req.body.Name;
    order.Phone = req.body.Phone;
    order.NumberOfDiners = req.body.NumberOfDiners;
    order.Datetime = req.body.Datetime;
    order.Smokers = req.body.Smokers;
    order.save(function(err) {
      if (err) {
        console.log(err);
      }
      res.sendFile(path.join(__dirname, "../www", "orderDone.html"));
    });
  })

  // Get to use order
  .get(function(req, res) {
    res.sendFile(path.join(__dirname, "../www", "orderTable.html"));
  });

//Show all your orders
router
  .route("/orders")
  // Get all your orders
  .get(async function(req, res) {
    await fs.readFile("./www/ordersBase.html", function(err, data) {
      const $ = cheerio.load(data);
      Order.find({}, function(err, orders) {
        for (let order of orders) {
          var orderRaw = `	<tr>
				<td>
					${order.Name}
				</td>
				<td>
					${order.Phone}
				</td>
				<td>
					${order.Datetime}
				</td>
				<td>
					${order.Smokers}
				</td>
			</tr>\n\t\t`;
          $("#orders").append(orderRaw);
          console.log(orderRaw);
        }

        fs.writeFile("./www/orders.html", $.html(), function(err) {
          if (err) {
            console.log(err);
          }
          res.sendFile(path.join(__dirname, "../www", "orders.html"));
        });
      });
    });
  });

//Show all your orderMeal
router
  .route("/orderMeals")
  // Get all your ordered Meals
  .get(async function(req, res) {
    await fs.readFile("./www/ordersMealBase.html", function(err, data) {
      const $ = cheerio.load(data);
      OrderMeal.find({}, function(err, orderMeals) {
        for (let orderMeal of orderMeals) {
          var orderMealRaw = `	<tr>
				<td>
					${orderMeal.User}
				</td>
				<td>
					<table>
					`;
          for (let product of orderMeal.Products) {
            // TO DO :
            // SHOW DETAIL OF ALL PRODUCTS
          }

          +`
					</table>
				</td>
				<td>
					${order.Datetime}
				</td>
				<td>
					${order.Smokers}
				</td>
			</tr>\n\t\t`;
          $("#orders").append(orderRaw);
          console.log(orderRaw);
        }

        fs.writeFile("./www/orders.html", $.html(), function(err) {
          if (err) {
            console.log(err);
          }
          res.sendFile(path.join(__dirname, "../www", "orders.html"));
        });
      });
    });
  });

// order your meal
router
  .route("/Meal")
  .post(function(req, res) {
    var meal = new Meal();
    meal.Pasta = req.body.Pasta;
    meal.Rice = req.body.Rice;
    meal.Salad = req.body.Salad;
    meal.Mashedpotato = req.body.Mashedpotato;
    meal.save(function(err) {
      if (err) {
        console.log(err);
      }
      res.sendFile(path.join(__dirname, "../www", "orderDone.html"));
    });
  })

  // // Get to use order
  .get(function(req, res) {
    res.sendFile(path.join(__dirname, "../www", "meal.html"));
  });

//pruducts
router
  .route("/Product")
  .post(function(req, res) {
    var product = new Product();
    product.id = req.body.id;
    product.img = req.body.img;
    product.name = req.body.name;
    product.desc = req.body.desc;
    product.save(function(err) {
      if (err) {
        console.log(err);
      }
      res.sendFile(path.join(__dirname, "../www", "orderDone.html"));
    });
  })

  // // Get to use products
  // TO DO : 1. CHANGE TO GET PRODUCT BY ID
  .get(function(req, res) {
    Product.find({}, function(err, products) {
      if (!err) {
        res.send(products);
      }
    });
  });

// order meal
router.route("/orderMeal").post(function(req, res) {
  var orderMeal = new OrderMeal();
  orderMeal.User = req.body.user;
  orderMeal.Products = req.body.products;
  orderMeal.save(function(err) {
    if (err) {
      console.log(err);
    }
    res.sendFile(path.join(__dirname, "../www", "orderDone.html"));
  });
});

//Export the Router
module.exports = router;
