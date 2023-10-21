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
  title: {
    type: String,
    trim: true,
  },
  // Event description as markdown
  description: {
    type: String,
  },
  // The datetime that the event is starting
  date: {
    type: Date,
    default: Date.now
  },
  // thirdParty - If the event was scraped from a public event calendar
  thirdParty: {
    type: Boolean,
    default: false
  },
  institutions: {
    type: Array,
    default: [],
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

// Create a mongoose model from that schema
const Event = mongoose.model('Event', eventSchema);

// Export the model to be used elsewhere
module.exports = Event;
