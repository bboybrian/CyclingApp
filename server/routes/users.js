var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html');
// var crypto = require('crypto');
var tempParser = require('gpxparser');
var togpx = require('../routes/togpx');
const gpxParser = require('../routes/GPXparser');
const { BlobServiceClient } = require("@azure/storage-blob");
require('dotenv').config();

const connStr = process.env.STORAGE_CONN_STR;
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(process.env.STORAGE_CONTAINER_NAME);

async function createBlobFromBuffer(containerClient, blobName, buffer, uploadOptions) {
  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
  
  // Upload buffer
  try {
    await blockBlobClient.uploadData(buffer, uploadOptions);
    return true;
  } catch {
    return false;
  }
}

// Route handling
router.get('/get-profile', async (req, res) => {
    try{
        const pool = await req.pool;
        const request = await pool.request();
        let query = `SELECT first_name, last_name, email, experience, type, ID FROM "User" WHERE ID = '${req.session.userId}'`;
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

router.post("/edit-profile", async (req, res) => {
  try{
    // Sanitize inputs
    var first_name = req.body.first_name ? sanitizeHtml(req.body.first_name) : "";
    var last_name = req.body.last_name ? sanitizeHtml(req.body.last_name) : "";
    var email = req.body.email ? sanitizeHtml(req.body.email) : "";
    var experience = req.body.experience ? sanitizeHtml(req.body.experience) : "";

    const pool = await req.pool;
    const request = await pool.request();
    let updateQuery = `UPDATE "User" SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', experience = '${experience}' WHERE ID = '${req.session.userId}'`;
    let response = await request.query(updateQuery);
    if (response.rowsAffected[0] > 0){
      // Success
      res.status(200).send(response);
    } else {
      console.error("EDIT PROFILE: Error updating User's profile");
      res.status(400).send("Edit profile failed");
    }
  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
});

// Courses Routes
router.get('/get-all-courses', async (req, res) => {
  try{
      let userId = req.session.userId;
      const pool = await req.pool;
      const request = await pool.request();
      let query = `SELECT ID, name, created_at from "Racecourse" WHERE User_id = '${userId}'`;
      let response = await request.query(query);
      if (response.recordset.length >= 0) {
        res.status(200).send(response);
      } else { 
        res.status(400).send(response);
      }
    } catch (err){
      console.error(err);
      res.sendStatus(400);
  }
});

router.post("/upload-course", async (req, res) => {
  try{
    let uploadFile = req.files.gpx;
    let fileName = req.body.name ? sanitizeHtml(req.body.name) : req.files.gpx.name;
    let time = (new Date().getTime()).toString();
    let userId = req.session.userId;

    // upload options
    const uploadOptions = {
      // indexed for searching
      tags: {
        createdBy: userId
      }
    }

    // parse
    var gpx_ = new gpxParser();
    gpx_.parse(uploadFile.data.toString());

    // prepare JSON gpx
    let json = gpx_.toGeoJSON();  
    let json_features = json.features[0].geometry.coordinates;
   
    // add derived columns
    let gpx = gpx_.tracks[0];

    let L = gpx.points.length;
    let bearings = [0];
    let slopes = [0];
    let curr_dist = gpx.distance.cumul[0];
    var pi = Math.PI;

    function radians(degrees) { return degrees * (pi/180); }
    function degrees(radians) { return radians * (180/pi); }

    for (let i = 0; i < L - 1; i++) {
        let lat1 = radians(gpx.points[i].lat)
        let lat2 = radians(gpx.points[i+1].lat)
        let lon1 = radians(gpx.points[i].lon)
        let lon2 = radians(gpx.points[i+1].lon)
        let ele1 = gpx.points[i].ele;
        let ele2 = gpx.points[i+1].ele;
        let bearing = Math.atan2(Math.sin(lon2-lon1)*Math.cos(lat2), (Math.cos(lat1)*Math.sin(lat2)) - (Math.sin(lat1)*Math.cos(lat1)*Math.cos(lon2-lon1))) % (2 * pi);
        bearings.push(degrees(bearing));
        if (i > 0) { 
          curr_dist = gpx.distance.cumul[i] - gpx.distance.cumul[i-1];
        }
        slopes.push((ele2 - ele1)/curr_dist);
    }

    let slope_percents = [0,slopes[1]];
    for (let i = 2; i < L - 1; i++) {
        let slope_percent = (slopes[i-1] + slopes[i] + slopes[i+1]) / 3;
        slope_percents.push(slope_percent);
    }
    slope_percents.push((slopes[L-2] + slopes[L-1]) / 2);

    for (let i = 0; i < L; i++) {
      if (i > 0) { json_features[i].push(gpx.distance.cumul[i-1]); }
      else { json_features[i].push(0); }
      json_features[i].push(bearings[i]);
      json_features[i].push(slopes[i]);
      json_features[i].push(slope_percents[i]);
    }

    json.features[0].geometry.coordinates = json_features;

    // convert back to gpx
    gpx_json = togpx(json); 

    // upload buffer
    const buffer = Buffer.from(gpx_json, "utf-8");
    const uploadRes = await createBlobFromBuffer(containerClient, fileName + "_" + time, buffer, uploadOptions);
    
    if (!uploadRes) { 
      res.status(400).send("Upload course failed 1");
      return; 
    }

    const pool = await req.pool;
    const request = await pool.request();
    
    let query = `INSERT INTO "Racecourse" (User_id, name, created_at, store_name) VALUES ('${userId}', '${fileName}', '${time}', '${fileName}')`;
    let response = await request.query(query);

    if (response.rowsAffected[0] > 0){
      // Success
      res.status(200).send("Successfully uploaded "+ fileName + "_" + time);
    } else {
      console.error("UPLOAD COURSE: Error uploading new course");
      res.status(400).send("Upload course failed");
    }

  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
})

router.get("/get-course", async (req, res) => {
  try{
    let racecourseId = sanitizeHtml(req.query.racecourseId);
    const pool = await req.pool;
    const request = await pool.request();
    if(racecourseId) {
      let query = `SELECT ID, name, store_name, created_at FROM "Racecourse" WHERE ID = '${racecourseId}'`;
      let response = await request.query(query);
      if (response.recordset.length >= 0){
        // Success
        const blobClient = containerClient.getBlobClient(response.recordset[0].store_name + "_" + response.recordset[0].created_at);
        
        const gpxContent = await blobClient.downloadToBuffer();

        // Add gpx to the response
        response.recordset[0].gpx = JSON.stringify(gpxContent.toString());
        
        res.status(200).send(response);
      } else {
        console.error("UPLOAD COURSE: Error loading a course");
        res.status(400).send("Loading course failed");
      }
    } else {
      console.error("Blank Course ID!");
      res.status(400).send("Invalid Course ID");
    }

  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
})

// Delete a course
router.delete("/course", async (req, res) => {
  try{
    let racecourseId = sanitizeHtml(req.body.racecourseId);
    const pool = await req.pool;
    const request = await pool.request();
    let sQuery = `SELECT * FROM "Racecourse" WHERE ID = '${racecourseId}'`;
    let searchResponse = await request.query(sQuery);
    let query = `DELETE FROM "Racecourse" WHERE ID = '${racecourseId}'`;
    let response = await request.query(query);
    
    if (response.rowsAffected[0] > 0){
      // Success
      containerClient.deleteBlob(searchResponse.recordset[0].store_name + "_" + searchResponse.recordset[0].created_at);
      res.status(200).send(response);
    } else {
      res.status(400).send("Invalid response");
    }

  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
})

// Update a course name
router.put("/course", async (req, res) => {
  try{
    let racecourseId = sanitizeHtml(req.body.racecourseId);
    let updatedCourseName = sanitizeHtml(req.body.updatedCourseName);
    if(racecourseId && updatedCourseName) {
      const pool = await req.pool;
      const request = await pool.request();
      let query = `UPDATE "Racecourse" 
        SET name = '${updatedCourseName}' 
        WHERE ID = '${racecourseId}'`;
      let response = await request.query(query);
      if (response.rowsAffected[0] > 0){
        // Success
        res.status(200).send(response);
      } else {
        res.status(400).send("Invalid response");
      }
    } else {
      res.status(400).send("Invalid properties sent to server.");
    }

  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
})

// replace a old gpx file with a new one
router.post("/replace-course", async (req, res) => {
  try{
    let uploadFile = req.body.gpx;
    let racecourseId = sanitizeHtml(req.body.racecourseId);

    let userId = req.session.userId;

    // upload options
    const uploadOptions = {
      // indexed for searching
      tags: {
        createdBy: userId
      }
    }

    const pool = await req.pool;
    const request = await pool.request();
    let sQuery = `SELECT * FROM "Racecourse" WHERE ID = '${racecourseId}'`;
    let searchResponse = await request.query(sQuery);
    
    if (searchResponse.rowsAffected[0] > 0){
      // Success
      containerClient.deleteBlob(searchResponse.recordset[0].store_name + "_" + searchResponse.recordset[0].created_at);
      const buffer = Buffer.from(uploadFile, "utf-8");
      const uploadRes = await createBlobFromBuffer(containerClient, searchResponse.recordset[0].store_name + "_" + searchResponse.recordset[0].created_at, buffer, uploadOptions);
      
      if (!uploadRes) { 
        res.status(400).send("Replace course failed"); 
      }
      else {
        res.status(200).send("Replace course succeeds");
      }
    }
    else {
      res.status(400).send("Course ID not found");
    }

  } catch (err){
    console.error(err);
    res.sendStatus(400);
  }
})

module.exports = router;