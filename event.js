/*
    Event related views and APIs
*/

// Require dependencies
const express = require("express");
const router = express.Router();

// MongoDB models
const Event = require("./models/event.js");

// Redirect /event --> /
router.get("/", (req, res) => {
    res.redirect("/");
});

// Display event
router.get("/:eventUUID", async (req, res) => {
    try {
        // Get the event
        const event = await Event.findOne({ uuid: req.params.eventUUID });
        if (!event) throw "Event does not exist: " + req.params.eventUUID;
        // If exists
        return res.render("event.html", {
            username: req.username,
            event: event
        });
    } catch (err) {
        console.log(err);
    }
    return res.render("404.html", {
        username: req.username,
    });
});

module.exports = router;
