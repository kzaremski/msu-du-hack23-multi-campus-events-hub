/*
    Multi Campus Events Hub User Router
 */

// Require dependencies
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// MongoDB models
const User = require("./models/user.js");

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
router.get("/", async (req, res) => {
    if (!req.session.username) return res.redirect("/profile/signin");
    res.render("user_profile.html", {
        username: req.session.username,
        user: await User.findOne({ email: req.session.username }),
    });
});

// Settings route
router.get("/settings", async (req, res) => {
    if (!req.session.username) return res.redirect("/profile/signin");
    res.render("user_settings.html", {
        username: req.session.username,
        user: await User.findOne({ email: req.session.username }),
    });
});

router.get("/signin", (req, res) => {
    if (req.session.username) return res.redirect("/");
    res.render("signin.html");
});

router.post("/signin", async (req, res) => {
    // If already logged in do nothing
    if (req.session.username) return res.redirect("/");

    // Get the contents of the form
    const email = req.body.email.trim();
    const password = req.body.password;
    const remember = req.body.remember ? req.body.remember == "on" : false;

    // Validate
    let message = "";
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmailRegex.test(email)) message = "Invalid email";
    if (!password.length >= 15) message = "Invalid password length";

    // If the message has content, then it was set by some sort of validator meaning that the form is invalid
    if (message.length > 0) return res.render("signin.html", { message: message });

    // Does the user exist?
    const existing = await User.findOne({ email: email });  
    if (!existing) return res.render("signin.html", { message: "Account does not exist" });

    // Compare the password hash
    const valid = await bcrypt.compare(password, existing.password);
    if (valid) {
        // Set the session and log in the user
        req.session.username = existing.email;
        req.session.user = existing;

        // Remember me
        if (remember) req.session.cookie.maxAge = 2628000000;

        // Add the login record
        let logins = existing.loginHistory;
        logins.push({
            "date": Date.now(),
            "ip": req.ip,
            "useragent": req.get("User-Agent")
        });
        await User.findOneAndUpdate({ email: email }, { loginHistory: logins });  

        // Redirect
        return res.redirect("/");
    } else {
        return res.render("signin.html", { message: "Incorrect password" });
    }
})

router.get("/create", (req, res) => {
    if (req.session.username) return res.redirect("/");
    res.render("signup.html");
});

router.post("/create", async (req, res) => {
    if (req.session.username) return res.redirect("/");

    // Get the contents of the form
    const email = req.body.email.trim();
    const password = req.body.password;
    const passwordR = req.body.passwordrepeat;
    const terms = req.body.termscheckbox ? req.body.termscheckbox == "on" : false;

    // ** Validate account creation form
    let message = "";
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (validEmailRegex.test(email)) {
        if (!extractTLD(email).toLowerCase() === "edu") message = "Email address is not an official school email"
    } else {
        message = "Invalid email"
    }
    if (!password.length >= 15) message = "Password must be 15 characters or longer";
    if (!password === passwordR) message = "Passwords do not match";
    if (!terms) message = "Terms of service not accepted";

    // If the message has content, then it was set by some sort of validator meaning that the form is invalid
    if (message.length > 0) return res.render("signup.html", { message: message });

    // Attempt account creation
    const existing = await User.findOne({ email: email });
    if (existing) return res.render("signup.html", { message: "Account already exists, <a href='/profile/signin'>Sign in!</a>" });

    // If there is no existing user with that username, create the new user
    // Hash the password
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
        email: email,
        firstName: "",
        password: hash,
        dateCreated: Date.now(),
        dateLastLogin: Date.now(),
        loginHistory: [{
            "date": Date.now(),
            "ip": req.ip,
            "useragent": req.get("User-Agent")
        }]
    });
    await user.save();

    // Set the session and log in the user
    req.session.username = user.email;
    req.session.user = user;

    // Send back the response
    if (message.length > 0) res.render("signup.html", { message: message });
    res.redirect("/");
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
