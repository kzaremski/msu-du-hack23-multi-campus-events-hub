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
const dateFilter = require("nunjucks-date-filter");
const cron = require("node-cron");
const bodyParser = require("body-parser");

// Routers
const userRouter = require("./user");

// Scraper
const scraper = require("./scraper");

// Aggregation / Search / Reccomendation Engine
const engine = require("./engine");

// Express app object
const app = express();

// Load environment configuration variables from a file
require("dotenv").config({ path: path.join(__dirname, "config.env") });

// Express middleware
app.use(express.json({ limit: "2mb" }));                    // JSON body parser
app.use(compression());                                     // gzip compression
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy({ setTo: "God" }));
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.set("trust proxy", 1);                                // Allow one layer of proxies (nginx reverse proxy)

// Configure server side sessions
app.use(session({
    secret: `${Math.random()}${Math.random()}${Math.random()}`,
    resave: false,
    saveUninitialized: true,
}));

// Nunjucks (templating engine)
app.set("views", path.join(__dirname, "views"));
const nunjucksOptions = {
    noCache: true,
    watch: true,
    autoescape: true,
    express: app
};
if (app.get("env") === "production") nunjucksOptions.noCache = false;
var njenv = nunjucks.configure("views", nunjucksOptions);
njenv.addFilter("date", dateFilter);

// Middleware for parsing the content of reques bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("500.html", {
        username: req.session.username
    });
});

// Static files
app.use("/static", express.static("static"));

// *** API
//app.use("/api", require(path.join(__dirname, "/api/api.js")));

// Index
app.get("/", async (req, res) => {
    res.render("index.html", {
        username: req.session.username,
        reccomended: await engine.getReccomended(3),
        recent: await engine.getMostRecent(3),
        popular: await engine.getMostPopular(3),
        upcoming: await engine.getSoonestUpcoming(3),
    });
})

// Attributions page
app.get("/attributions", (req, res) => {
    res.render("attributions.html", {
        username: req.session.username
    });
})

// Routers
app.use("/profile", userRouter);

// Handle 404
app.use(function (req, res, next) {
    res.status(404).render("404.html", {
        username: req.session.username
    });
});

// Schedule scraping @ 2:00AM & 4:00PM
cron.schedule('0 2,14 * * *', () => {
    scraper.scrapeAllAndUpdate();
});

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
