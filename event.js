/*
    Event related views and APIs
*/

// Require dependencies
const express = require("express");
const router = express.Router();

// MongoDB models
const Event = require("./models/event.js");
const User = require("./models/user.js");

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
            username: req.session.username,
            user: await User.findOne({ email: req.session.username }),
            event: event
        });
    } catch (err) {
        console.log(err);
    }
    return res.render("404.html", {
        username: req.session.username,
    });
});

router.get("/:eventUUID/register", async(req, res) => {
    if (!req.session.username) return res.redirect("/profile/signin");

    try {
        // Get the event
        const event = await Event.findOne({ uuid: req.params.eventUUID });
        if (!event) throw "Event does not exist: " + req.params.eventUUID;

        let registered = event.registered.slice()
        if (registered.indexOf(req.session.username) >= 0) return res.redirect("/event/" + encodeURIComponent(event.uuid));
        registered.push(req.session.username)
        
        // Add the user to the registration
        await Event.findOneAndUpdate(
            { uuid: event.uuid },
            { registered: registered }
        );

        // Add the event to the users list
        const user = await User.findOne({ email: req.session.username });
        let userRegistered = user.registeredEvents.slice();
        if (userRegistered.indexOf(event.uuid) >= 0) return res.redirect("/event/" + encodeURIComponent(event.uuid));
        userRegistered.push(event.uuid)
        
        await User.findOneAndUpdate(
            { email: req.session.username },
            { registeredEvents: userRegistered }
        );

        return res.redirect("/event/" + encodeURIComponent(event.uuid));
    } catch (err) {
        console.log(err);
    }
    return res.render("404.html", {
        username: req.session.username,
    });
});

router.get("/:eventUUID/unregister", async(req, res) => {
    if (!req.session.username) return res.redirect("/profile/signin");

    try {
        // Get the event
        const event = await Event.findOne({ uuid: req.params.eventUUID });
        if (!event) throw "Event does not exist: " + req.params.eventUUID;

        let registered = event.registered.slice()
        if (registered.indexOf(req.session.username) < 0) return res.redirect("/event/" + encodeURIComponent(event.uuid));
        registered.splice(registered.indexOf(req.session.username), 1);
        
        // Add the user to the registration
        await Event.findOneAndUpdate(
            { uuid: event.uuid },
            { registered: registered }
        );

        // Add the event to the users list
        const user = await User.findOne({ email: req.session.username });
        let userRegistered = user.registeredEvents.slice();
        if (userRegistered.indexOf(event.uuid) < 0) return res.redirect("/event/" + encodeURIComponent(event.uuid));
        userRegistered.splice(userRegistered.indexOf(event.uuid), 1);
        
        await User.findOneAndUpdate(
            { email: req.session.username },
            { registeredEvents: userRegistered }
        );

        return res.redirect("/event/" + encodeURIComponent(event.uuid));
    } catch (err) {
        console.log(err);
    }
    return res.render("404.html", {
        username: req.session.username,
    });
});

module.exports = router;
