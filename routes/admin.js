var express = require("express");
var router = express.Router();
var pool = require("./pool");
var LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage("./scratch");
/* GET users listing. */
router.get("/adminlogin", function (req, res, next) {
  res.render("loginflight", { msg: "" });
});

router.get("/adminlogout", function (req, res, next) {
  localStorage.clear();

  res.render("loginflight", { msg: "" });
});

router.post("/checkadminlogin", function (req, res, next) {
  pool.query(
    "select * from admins where (emailid=? or mobileno=?) and password=?",
    [req.body.userid, req.body.userid, req.body.password],
    function (error, result) {
      if (error) {
        console.log(error)
        res.render("loginflight", { msg: "SERVER ERROR....." });
      } else {
        if (result.length == 1) {
          localStorage.setItem(
            "admin",
            JSON.stringify({
              emailid: result[0].emailid,
              mobileno: result[0].mobileno,
            })
          );
          res.render("Dashboard", { result: result[0] });
        } else {
          res.render("loginflight", { msg: "Invalid UserId/Password" });
        }
      }
    }
  );
});

module.exports = router;
