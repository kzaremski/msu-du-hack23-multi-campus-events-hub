/*
    User Account Database Model
*/

// Require dependencies
const mongoose = require('mongoose');
const uuid = require('uuid');
const fs = require('fs');

// User account schema
const userSchema = new mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        trim: true,
        default: uuid.v4
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    extension: String,
    data: Buffer
});

// Create a mongoose model from that schema
const Media = mongoose.model('Media', mediaSchema);

// Export the model to be used elsewhere
module.exports = Media;
