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
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const bcrypt = require("bcrypt");

// Routers
const user = require("./user");

// Express app object
const app = express();

// Load environment configuration variables from a file
require("dotenv").config({ path: path.join(__dirname, "config.env") });

// Express middleware
app.use(express.json({ limit: "2mb" }));                    // JSON body parser
app.use(compression());                                   // gzip compression
/*if (app.get("env") === "production") {                    // helmet security middleware if in production
  //app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy({ setTo: "God" }));
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());
}*/
app.set("trust proxy", 1);                                // Allow one layer of proxies (nginx reverse proxy)

// Configure server side sessions
app.use(session({
    secret: `${Math.random()}${Math.random()}${Math.random()}`,
    resave: false,
    saveUninitialized: true,
}));

// Nunjucks (templating engine)
const nunjucksOptions = {
    noCache: true,
    watch: true,
    autoescape: true,
    express: app
};
if (app.get("env") === "production") nunjucksOptions.noCache = false;
nunjucks.configure("views", nunjucksOptions);
app.set("views", path.join(__dirname, "views"));

// *** API
//app.use("/api", require(path.join(__dirname, "/api/api.js")));

// Index
app.get("/", (req, res) => {
    res.render("index.html", {
        username: req.session.username
    });
})

// Routers
app.use("/user", user);

// Initialization
(async function init() {
    // Notify startup
    console.log(`Application server (${app.get("env").toUpperCase()}) started at ${new Date().toISOString()}`);

    // Connect to database
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to the MongoDB database at ${process.env.MONGODB_URI}`);
    } catch (err) {
        console.error(`There was an issue connecting to the MongoDB database \n-->${err}`);
        return;
    }

    // Express app listening on the development or production port
    const port = process.env.PORT || 3000;
    return app.listen(port, () => {
        console.log(`Listening for HTTP requests on port ${port}`);
    });
})();
