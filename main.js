/*
    MSU-DU Hack 23 Hackathon

    ** Multi-Campus Events Hub **

    Team Members:
        Annabella
        Ama
        Joel
        Richard
        Konstantin

    
*/

// Require dependencies
const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const bcrypt = require("bcrypt");

// API
app.use("/api", require(path.join(__dirname, "/api/api.js")));

// Initialization
(async function init() {
    // Notify startup
    console.log(`Application server (${app.get("env").toUpperCase()}) started at ${new Date().toISOString()}`);

    // Express app listening on the development or production port
    const port = process.env.PORT || 3000;
    return app.listen(port, () => {
        console.log(`Listening for HTTP requests on port ${port}`);
    });
})();

