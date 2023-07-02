var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');
var crypto = require('crypto');
var emailValidator = require('deep-email-validator');

// Email validator, used on sign up
async function validateEmail(email, callback) {
  var mailres = await emailValidator.validate({
      email: email,
      validateRegex: true,
      validateMx: true,
      validateType: true,
      validateSMTP: false,
  });
  callback(mailres);
}

// Route handling
router.get('/', (req, res) => {
    res.send('<h2>Hello from Express.js server!!</h2>');
});

// Login route
router.post("/login", async (req, res) => {
  try{
    if (req.body.email && req.body.password) {
      let email = sanitizeHtml(req.body.email);
      let password = sanitizeHtml(req.body.password);
      let passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      const pool = await req.pool;
      const request = await pool.request();

      // Check if email is already used
      let query = `SELECT ID, type FROM "User" WHERE email = '${email}' AND password = '${passwordHash}'`;
      let response = await request.query(query);
      if (response.recordset.length == 0) {
        console.error("LOGIN: email or password is wrong");
        res.status(400).send("Please check your email and/or password again.");
      }
      else {
        req.session.userId = response.recordset[0].ID;
        req.session.userType = response.recordset[0].type;
        req.session.save();
        res.status(200).send(response);
      }
    }
    else {
      // Email and/or password missing
      console.error("LOGIN: Email and/or password missing");
      res.status(400).send("Please input your email and password.");
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
})

// Register route
router.post("/register", async (req, res) => {
  try{
    if (req.body.email && req.body.password && req.body.type) {
      let email = sanitizeHtml(req.body.email);
      let password = sanitizeHtml(req.body.password);
      let type = sanitizeHtml(req.body.type);   // May be redundant since 'type' is chosen not inputted
      let passwordHash = crypto.createHash('sha256').update(password).digest('hex');

      const pool = await req.pool;
      const request = await pool.request();
      // Check if email is used
      let query = `SELECT email FROM "User" WHERE email = '${email}'`;
      let response = await request.query(query);
      if (response.recordset.length == 0) {
        // Validate email
        validateEmail(email, async (mailres) => {
          if (!mailres['valid']) {
              console.error("REGISTER: email validation failed")
              res.status(400).send("This email does not exist.");
          } else {
            let query2 = `INSERT INTO "User" (email, type, password) VALUES ('${email}', '${type}', '${passwordHash}')`
            let response = await request.query(query2);
            res.status(200).send(response);
          }
        });
      }
      else {
        console.error("REGISTER: email is already taken");
        res.status(400).send("There is already an account associated with this email.");
      }
    }
    else {
      // Email and/or password and/or type missing
      console.error("SIGNUP: Info missing");
      res.status(400).send("Please fill up all fields.");
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
})

module.exports = router;