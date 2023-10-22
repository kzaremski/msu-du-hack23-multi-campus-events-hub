/*
    msudenver.edu calendar scraper
 */

// Require dependencies
import("node-fetch");
const ical = require("node-ical");

// iCal link
const ICAL_LINK = "http://www.trumba.com/calendars/msudenver-events-calendars.ics";

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
                
                // Additional fields
                let image = "";

                // If it has custom properties
                try {
                    if (event.hasOwnProperty("TRUMBA-CUSTOMFIELD")) {
                        for (const [key, property] of Object.entries(event["TRUMBA-CUSTOMFIELD"])) {
                            // skip junk
                            if (!property.hasOwnProperty("params")) continue;
                            if (!property["params"].hasOwnProperty("NAME")) continue;
                            
                            const imageRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
                            
                            switch (property["params"]["NAME"]) {
                                case "Event image":
                                    image = imageRegex.match(property.val);
                                    break;
                                case "Event Contact":
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                } catch(err) {
                    console.log(`Failed to parse TRUMBA-CUSTOMFIELD ${err}`)
                }
                
                
                // Build the object
                parsed.push({
                    uuid: event.uid,
                    url: event.url,
                    title: event.summary,
                    description: event.description,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    created: new Date(event.dtstamp),
                    categories: event.categories,
                    location: event.location,
                    scraped: true,
                    scrapedFrom: "https://msudenver.trumba.com/",
                    original: "",
                    image: image,
                    institution: "Metropolitan State University of Denver"
                })
            } catch(err) {
                console.log(`Error while parsing ICS item ${event}\n${err}`);
            }
        }

        // Notify
        console.log(`${parsed.length} event(s) loaded from msudenver.edu`);
        
        // Return the parsed events
        return parsed;
    } catch (err) {
        console.error(`Failed scraping of msudenver.edu: ${err}`);
    }
}

module.exports = scrape;
