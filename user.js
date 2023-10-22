/*
    Multi Campus Events Hub User Router
 */

// Require dependencies
const express = require("express");
const router = express.Router();

/**
 * Get the TLD from an email
 * @param {String} email - Email string
 * @returns tld part of email string
 */
function extractTLD(email) {
    const tldRegex = /@[\w.-]+\.([a-zA-Z]{2,})$/;
    const match = email.match(tldRegex);
    return match && match[1] ? match[1] : null;
}

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

router.post("/create", (req, res) => {
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
