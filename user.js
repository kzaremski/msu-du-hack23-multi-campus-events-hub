/*
    Multi Campus Events Hub User Router
 */

// Require dependencies
const router = express.router();

// Login route
router.get("/login", (req, res) => {
    if (req.session.username) return res.redirect("/");
    res.render("login.njk");
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
