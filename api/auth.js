// Require dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// Logging module
const log = require('../log.js');

// User account database model
const User = require('../models/user.js');

// Login action API endpoint
router.post('/login', async (req, res) => {
  // If they are already logged in, notify
  if (req.session.username) return res.send({ code: 'already_logged_in' });
  
  // Validate inputs
  if (!req.body.username) return res.send({ code: 'no_username' });
  if (!req.body.password) return res.send({ code: 'no_password' });
  
  // Search for the user account in the database and then test the password against the password hash
  try {
    // Search for account, if no account notify user of wrong credentials
    const user = await User.findOne({ username: req.body.username.trim() });
    if (!user) {
      log.info('USER', `Attempted login as "${req.body.username.trim()}" from ${req.ip}`);
      return res.send({ code: 'wrong_username' });
    }
  
    // Test the password against the hash for that account in the database
    const match = await bcrypt.compare(req.body.password, user.password);
    // If the password matches, notify of success and set the session
    if (match) {
      // Set the session
      req.session.username = user.username;
      req.session.userObject = user;
      // Report success to the front end
      res.send({ code: 'success' });
      // Log the slogin in the database
      log.info('USER', `Successful login as "${req.body.username.trim()}" from ${req.ip}`);
      // Update the login history for the account
      let loginHistory = [...user.loginHistory];
      const loginDate = new Date();
      loginHistory.push({
        date: loginDate,
        origin: req.ip,
        useragent: req.headers['user-agent']
      });
      await User.updateOne({ username: user.username }, { loginHistory: loginHistory, dateLastLogin: loginDate });
    } else {
      res.send({ code: 'wrong_password' });
    }
  } catch(err) {
    res.send({ code: 'server_error' });
    log.error('USER', `Server error while attempting login as "${req.body.username.trim()}" from ${req.ip} -- ${err}`);
  }
});

// Authentication get route
// Send back the current authentication status and user information
router.post('/get', async (req, res) => {
  // If not logged in, send back null username
  if (!req.session.username) return res.send(JSON.stringify({ username: null }));
  // If currently logged in, get user info from the database and send back
  try {
    const user = await User.findOne({ username: req.session.username });
    res.send(JSON.stringify({
      username: user.username,
      name: user.name,
      email: user.email,
      dateCreated: user.dateCreated,
      dateLastLogin: user.dateLastLogin,
      loginHistory: user.loginHistory,
      type: user.type
    }));
  } catch(err) {
    console.error(`🚨 User account authentication API error \n-->${err}`);
    res.send(JSON.stringify({ code: 'server_error' }));
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // If user is not logged in, do nothing
  if (!req.session.username) return res.send(JSON.stringify({ code: 'not_logged_in' }));
  // Destroy session
  req.session.destroy(() => {
    // Send 
    res.send(JSON.stringify({ code: 'success' }));
  });
});

// Export to be used elsewhere
module.exports = router;