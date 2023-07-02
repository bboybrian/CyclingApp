let express = require('express');
let router = express.Router();
let sanitizeHtml = require('sanitize-html');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var emailValidator = require('deep-email-validator');
require('dotenv').config();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD
  },
  tls: {
    secureProtocol: "TLSv1_method"
  }
});

// Email validator
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

function generate_random_password() {
  let text = "";
  let possible = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

// Get all athletes (First name, last name) belonging to coach, for "MyAthletes"
router.get('/get-my-athletes', async (req, res) => {
    try{
        const pool = await req.pool;
        const request = await pool.request();
        let userId = sanitizeHtml(req.session.userId);    // Coach's id

        let query = `SELECT "Athlete_id", "first_name", "last_name", "dob", "gender", "height", "mass", 
                    "other_mass", "w_recovery", "critical_power", "w_prime"
                     FROM "User" INNER JOIN "AthleteCoach"
                     ON "ID" = "Athlete_id"
                     INNER JOIN "Physical"
                     ON "User_id" = "Athlete_id"
                     WHERE Coach_id = '${userId}'`;

        let response = await request.query(query);
        if (response.recordset.length > 0) {
          res.status(200).send(response);
        } else {
          res.status(400).send(response);
        }
      } catch (err){
        console.error(err);
        res.sendStatus(400);
      }
});

// Coach creating athletes (prototype or real)
router.post('/create-athlete', async (req, res) => {
  try {
      const pool = await req.pool;
      const request = await pool.request();
      let CoachId = sanitizeHtml(req.session.userId);    // Coach's id
      
      // athlete's attributes
      let first_name = req.body.first_name ? sanitizeHtml(req.body.first_name) : null;
      let last_name = req.body.last_name ? sanitizeHtml(req.body.last_name) : null;
      let height = req.body.height ? sanitizeHtml(req.body.height) : null;
      let mass = req.body.mass ? sanitizeHtml(req.body.mass) : null;
      let w_prime = req.body.w_prime ? sanitizeHtml(req.body.w_prime) : null;
      let dob = req.body.dob ? sanitizeHtml(req.body.dob) : null; // YYYY/MM/DD
      let gender = req.body.gender ? sanitizeHtml(req.body.gender) : "";
      let other_mass = req.body.other_mass ? sanitizeHtml(req.body.other_mass) : null;
      let w_recovery = req.body.w_recovery ? sanitizeHtml(req.body.w_recovery) : null;
      let critical_power = req.body.critical_power ? sanitizeHtml(req.body.critical_power) : null;
      let athleteEmail = req.body.athleteEmail ? sanitizeHtml(req.body.athleteEmail) : null;
      let password = athleteEmail ? generate_random_password() : null;
      let passwordHash = password ? crypto.createHash('sha256').update(password).digest('hex') : null;

      let failed = false;
      if (athleteEmail) {
        let query = `SELECT email FROM "User" WHERE email = '${athleteEmail}'`;
        let response = await request.query(query);
        if (response.recordset.length == 0) {
          // Validate email
          validateEmail(athleteEmail, async (mailres) => {
            if (!mailres['valid']) {
              failed = true;
              console.error("REGISTER: email validation failed")
              res.status(400).send("This email does not exist.");
              return;
            }
          });
        }
        else {
          console.error("REGISTER: email is already taken");
          res.status(400).send("There is already an account associated with this email.");
          return;
        }
      }

      let query = `BEGIN;
      declare @id NVARCHAR(255);
      SET @id=NEWID();
      INSERT INTO "User" (ID, first_name, last_name, type, email, password) VALUES (@id, '${first_name}', '${last_name}', 'athlete', '${athleteEmail}', '${passwordHash}');
      INSERT INTO "Physical" (User_id, dob, gender, height, mass, other_mass, w_recovery, critical_power, w_prime) VALUES (@id, '${dob}', '${gender}', ${height}, ${mass}, ${other_mass}, ${w_recovery}, ${critical_power}, ${w_prime});
      INSERT INTO "AthleteCoach" (Athlete_id, Coach_id) VALUES (@id, '${CoachId}');
      END;`;
      let response = await request.query(query);
      if (response.rowsAffected[0] > 0){
        // Success
        if (athleteEmail) {
          var mailOptions = {
            from: process.env.MAILER_EMAIL,
            to: athleteEmail,
            subject: "Welcome to Ultimate Bike Split",
            html: `<!DOCTYPE html>
            <body>
                <p>Your coach has invited you to use this platform to facilitate your future trainings</p>
                Here is your login credentials.
                <p>Email: ${athleteEmail}</p>
                <p>Password: ${password}</p>
            </body>`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.error(error);
              res.status(400).send("Sending email failed");
            } else {
              // successfully sent email
              console.log('Email sent: ' + info.response);
              res.status(200).send(response);
            }
          });
        }
        else {
        res.status(200).send(response);
        }
      } else {
        console.error("CREATE ATHLETE: Error adding new athletes");
        res.status(400).send("Add new athlete failed");
      }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

// Assign athlete to coach. Route sent from coach's account (can be changed)
router.post('/assign-athlete', async (req, res) => {
    try {
        const pool = await req.pool;
        const request = await pool.request();
        let CoachId = sanitizeHtml(req.session.userId);    // Coach's id
        let AthleteId = sanitizeHtml(req.body.athleteId);    // Athlete's id

        // Check if athlete already has coach
        let query = `SELECT * FROM "AthleteCoach" WHERE Athlete_id = '${AthleteId}'`;
        let response = await request.query(query);
        if (response.recordset.length == 0) {
            let query2 = `BEGIN;
            INSERT INTO "AthleteCoach" (Athlete_id, Coach_id) VALUES ('${AthleteId}', '${CoachId}');
            SELECT "User_id" AS Athlete_id,"first_name", "last_name", "dob", "gender", "height", "mass", 
            "training_elevation", "other_mass", "ftp", "max_hr", "w_recovery", "critical_power" FROM "Physical" 
            INNER JOIN "User" 
            ON "User_id" = dbo.[User]."ID"
            WHERE User_id = '${AthleteId}';
            END;`
            let response = await request.query(query2);
            res.status(200).send(response);
        }
        else {
          res.status(400).send("Athlete already has a coach");
        }
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
});

// Delete an athlete
router.delete("/athlete", async (req, res) => {
  try{
    let athleteId = sanitizeHtml(req.body.athleteId);
    let userId = req.session.userId;
    const pool = await req.pool;
    const request = await pool.request();
    let query = `DELETE FROM "AthleteCoach" WHERE Athlete_id = '${athleteId}' AND Coach_id = '${userId}'`;
    let response = await request.query(query);
    
    if (response.rowsAffected[0] > 0){
      // Success
      res.status(200).send(response);
    } else {
      res.status(400).send("Invalid response");
    }

  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
});

module.exports = router;
