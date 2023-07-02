let express = require('express');
let router = express.Router();
let sanitizeHtml = require('sanitize-html');
// let crypto = require('crypto');

// Route handling
router.get('/get-physical', async (req, res) => {
    try{
        const pool = await req.pool;
        const request = await pool.request();

        // If sender is a coach, there should be a extra input athleteID
        let userId = req.query.athleteId ? sanitizeHtml(req.query.athleteId) : req.session.userId;

        let query = `SELECT * FROM "Physical" WHERE User_id = '${userId}'`;
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

router.post("/edit-physical", async (req, res) => {
    try{
      // Sanitize inputs
      let height = req.body.height ? sanitizeHtml(req.body.height) : null;
      let mass = req.body.mass ? sanitizeHtml(req.body.mass) : null;
      let dob = req.body.dob ? sanitizeHtml(req.body.dob) : null; // YYYY/MM/DD
      let gender = req.body.gender ? sanitizeHtml(req.body.gender) : "";
      let other_mass = req.body.other_mass ? sanitizeHtml(req.body.other_mass) : null;
      let w_recovery = req.body.w_recovery ? sanitizeHtml(req.body.w_recovery) : null;
      let critical_power = req.body.critical_power ? sanitizeHtml(req.body.critical_power) : null;
      let w_prime = req.body.w_prime ? sanitizeHtml(req.body.w_prime) : null;
      // If sender is a coach, there should be a extra input athleteID
      let userId = req.body.athleteId ? sanitizeHtml(req.body.athleteId) : req.session.userId;

      // Update user and physical table using nested queries
      const pool = await req.pool;
      const request = await pool.request();
      let searchQuery = `SELECT ID FROM "Physical" WHERE User_id = '${userId}'`;
      let response = await request.query(searchQuery);
      if (response.recordset.length == 0) {
        // User table updated, now update physical table
        let insertQuery = `INSERT INTO "Physical" (User_id, dob, gender, height, mass, other_mass, w_recovery, critical_power, w_prime) VALUES ('${userId}', '${dob}', '${gender}', ${height}, ${mass}, ${other_mass}, ${w_recovery}, ${critical_power}, ${w_prime})`;
        let response = await request.query(insertQuery);
        if (response.rowsAffected[0] > 0){
            // Success
            res.status(200).send(response);
        } else {
            console.error("EDIT PROFILE: Error inserting physical profile");
            res.status(400).send("Edit physical profile failed");
        }
      }
      else {
        let updateQuery = `UPDATE "Physical" SET dob = '${dob}', gender = '${gender}', height = ${height}, mass = ${mass}, other_mass = ${other_mass}, w_recovery = ${w_recovery}, critical_power = ${critical_power}, w_prime = ${w_prime} WHERE User_id = '${userId}'`;
        let response = await request.query(updateQuery);
        if (response.rowsAffected[0] > 0){
          // Success
          res.status(200).send(response);
        } else {
          console.error("EDIT PROFILE: Error updating physical profile");
          res.status(400).send("Edit physical profile failed");
        }
      }
    } catch (err){
      console.error(err);
      res.sendStatus(400);
    }
});

// Bike routes
router.get('/get-bikes', async (req, res) => {
  try{
      const pool = await req.pool;
      const request = await pool.request();
      // If sender is a coach, there should be a extra input athleteID
      let userId = req.query.athleteId ? sanitizeHtml(req.query.athleteId) : req.session.userId;
      let query = `SELECT * FROM "Bike" WHERE User_id = '${userId}'`;
      let response = await request.query(query);

      if (response.recordset.length > 0) {
        res.status(200).send(response);
      } else {
        console.error("GET BIKES: This athlete has no bikes");
        res.status(400).send(response);
      }
    } catch (err){
      console.error(err);
      res.sendStatus(400);
  }
});

router.post("/insert-bike", async (req, res) => {
  try{
    // Sanitize inputs
    let userId = req.body.athleteId ? sanitizeHtml(req.body.athleteId) : req.session.userId;
    let name = req.body.name ? sanitizeHtml(req.body.name) : null;
    let mass = req.body.mass ? sanitizeHtml(req.body.mass) : null;
    let crr = req.body.crr ? sanitizeHtml(req.body.crr) : null;
    let mech_eff = req.body.mech_eff ? sanitizeHtml(req.body.mech_eff) : null;
    let moi_whl_front = req.body.moi_whl_front ? sanitizeHtml(req.body.moi_whl_front) : null;
    let moi_whl_rear = req.body.moi_whl_rear ? sanitizeHtml(req.body.moi_whl_rear) : null;
    let wheel_radius = req.body.wheel_radius ? sanitizeHtml(req.body.wheel_radius) : null;
    let cda_12 = req.body.cda_12 ? sanitizeHtml(req.body.cda_12) : null;
    let cda_14 = req.body.cda_14 ? sanitizeHtml(req.body.cda_14) : null;
    let cda_16 = req.body.cda_16 ? sanitizeHtml(req.body.cda_16) : null;
    let cda_climb = req.body.cda_climb ? sanitizeHtml(req.body.cda_climb) : null;
    let cda_descend = req.body.cda_descend ? sanitizeHtml(req.body.cda_descend) : null;

    // Update bike table using nested queries
    const pool = await req.pool;
    const request = await pool.request();
    let query = `INSERT INTO "Bike" (name, User_id, mass, crr, mech_eff, moi_whl_front, moi_whl_rear, wheel_radius, cda_12, cda_14, cda_16, cda_climb, cda_descend) VALUES ('${name}', '${userId}', ${mass}, ${crr}, ${mech_eff}, ${moi_whl_front}, ${moi_whl_rear}, ${wheel_radius}, ${cda_12}, ${cda_14}, ${cda_16}, ${cda_climb}, ${cda_descend})`;
    let response = await request.query(query);
    if (response.rowsAffected[0] > 0){
        // Success
        res.status(200).send(response);
    } else {
        console.error("EDIT PROFILE: Error adding bike");
        res.status(400).send("Edit bike failed");
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
});

router.post("/edit-bike", async (req, res) => {
  try{
    // Sanitize inputs
    let bikeId = sanitizeHtml(req.body.bikeId)
    let name = req.body.name ? sanitizeHtml(req.body.name) : null;
    let mass = req.body.mass ? sanitizeHtml(req.body.mass) : null;
    let crr = req.body.crr ? sanitizeHtml(req.body.crr) : null;
    let mech_eff = req.body.mech_eff ? sanitizeHtml(req.body.mech_eff) : null;
    let moi_whl_front = req.body.moi_whl_front ? sanitizeHtml(req.body.moi_whl_front) : null;
    let moi_whl_rear = req.body.moi_whl_rear ? sanitizeHtml(req.body.moi_whl_rear) : null;
    let wheel_radius = req.body.wheel_radius ? sanitizeHtml(req.body.wheel_radius) : null;
    let cda_12 = req.body.cda_12 ? sanitizeHtml(req.body.cda_12) : null;
    let cda_14 = req.body.cda_14 ? sanitizeHtml(req.body.cda_14) : null;
    let cda_16 = req.body.cda_16 ? sanitizeHtml(req.body.cda_16) : null;
    let cda_climb = req.body.cda_climb ? sanitizeHtml(req.body.cda_climb) : null;
    let cda_descend = req.body.cda_descend ? sanitizeHtml(req.body.cda_descend) : null;

    // Update bike table using nested queries
    const pool = await req.pool;
    const request = await pool.request();
    let updateQuery = `UPDATE "Bike" SET name = '${name}', mass = ${mass}, crr = ${crr}, mech_eff = ${mech_eff}, moi_whl_front = ${moi_whl_front}, moi_whl_rear = ${moi_whl_rear}, wheel_radius = ${wheel_radius}, cda_12 = ${cda_12}, cda_14 = ${cda_14}, cda_16 = ${cda_16}, cda_climb = ${cda_climb}, cda_descend = ${cda_descend} WHERE ID = '${bikeId}'`;
    let response = await request.query(updateQuery);
    if (response.rowsAffected[0] > 0){
      // Success
      res.status(200).send(response);
    } else {
      console.error("EDIT PROFILE: Error updating bike");
      res.status(400).send("Edit bike failed");
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
});

// Delete a bike
router.delete("/bike", async (req, res) => {
  try{
    let bikeId = sanitizeHtml(req.body.bikeId);
    const pool = await req.pool;
    const request = await pool.request();
    let query = `DELETE FROM "Bike" WHERE ID = '${bikeId}'`;
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