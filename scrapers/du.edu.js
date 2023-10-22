/*
    du.edu (crimson connect) calendar scraper
 */

// Require dependencies
import("node-fetch");
const ical = require("node-ical");

// iCal link
const ICAL_LINK = "https://crimsonconnect.du.edu/ical/ical_du.ics";

async function scrape() {
    try {
        // Load from iCal
        const events = await ical.async.fromURL(ICAL_LINK);
        const timezone = events.vcalendar["WR-TIMEZONE"];

        let parsed = [];
        
        // Iterate through and parse
        for (const [uid, event] of Object.entries(events)) {
            try {
                // Skip non-events
                if (event.type != "VEVENT") continue;
                
                // Build the object
                parsed.push({
                    uuid: event.uid,
                    url: event.url,
                    title: event.summary.val,
                    description: event.description,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    created: new Date(event.dtstamp),
                    categories: event.categories,
                    location: event.location,
                    scraped: true,
                    original: "",
                    image: "",
                    institution: "University of Denver"
                })
            } catch(err) {
                console.log(`Error while parsing ICS item ${event}\n${err}`);
            }
        }

        // Notify
        console.log(`${parsed.length} event(s) loaded from du.edu`);
        
        console.log(events);

        // Return the parsed events
        return parsed;
    } catch (err) {
        console.error(`Failed scraping of du.edu: ${err}`);
    }
}

module.exports = scrape;
