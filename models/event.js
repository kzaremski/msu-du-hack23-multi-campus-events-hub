// Require dependencies
const mongoose = require('mongoose');
const uuid = require('uuid');

// Event schema
const eventSchema = new mongoose.Schema({
    // UUID for the new event
    uuid: {
        type: String,
        unique: true,
        trim: true,
        default: uuid.v4
    },
    url: {
        trim: true,
        type: String
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String, // Event description as markdown
    },
    location: {
        type: String,
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    },
    categories: Array,
    image: {
        type: String,
        default: ""
    },
    institution: {
        type: String,
        default: ""
    },
    original: {
        type: String,
        default: ""
    },
    scraped: Boolean,
    scrapedFrom: {
        type: String,
        trim: true
    },
    owner: {
        type: String,
        default: ""
    },
    deleted: {
        type: Boolean,
        default: false
    },
    registered: {
        type: Array,
        default: []
    }
});

// Create a mongoose model from that schema
const Event = mongoose.model('Event', eventSchema);

// Export the model to be used elsewhere
module.exports = Event;
