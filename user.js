/*
    Multi Campus Events Hub User Router
 */

// Require dependencies
const express = require("express");
const router = express.Router();

// Login route
router.get("/", (req, res) => {
    if (!req.session.username) return res.redirect("/profile/login");
    res.render("user_profile.html");
});

router.get("/signin", (req, res) => {
    if (req.session.username) return res.redirect("/profile/");
    res.render("signin.html");
});
router.get("/create", (req, res) => {
    if (req.session.username) return res.redirect("/profile/");
    res.render("signup.html");
});

// Logout route
router.get("/logout", (req, res) => {
    if (!req.session.username) return res.redirect("/");
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// Export
module.exports = router;
