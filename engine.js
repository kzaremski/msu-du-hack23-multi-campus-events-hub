/*
    Search / Aggregation / Reccomendation Engine

*/

// Mongoose models
const Event = require("./models/event");

/**
 * Get the most recently created/updated events
 */
async function getMostRecent(count) {
    // Build aggregation pipeline
    let aggregationPipeline = [
        { $match: { start: { $gte: new Date() } } }, // Must not be a past event
        { $sort: { created: -1 } }
    ]
    // If limiting
    if (count && count > 0) aggregationPipeline.push({ $limit: count });

    const results = await Event.aggregate(aggregationPipeline);

    return results;
}

async function getMostPopular(count) {
    // Build aggregation pipeline
    let aggregationPipeline = [
        { $match: { start: { $gte: new Date() } } }, // Must not be a past event
        { $addFields: { length: { $size: "$registered" } } },
        { $sort: { length: -1 } }
    ]
    // If limiting
    if (count && count > 0) aggregationPipeline.push({ $limit: count });

    const results = await Event.aggregate(aggregationPipeline);

    return results;
}

async function getRecommended(user, count) {
    let aggregationPipeline = [
        { $match: { start: { $gte: new Date() } } }, // Must not be a past event
        { $sample: { size: count } },
        { $sort: { start: 1 } }
    ];

    const results = await Event.aggregate(aggregationPipeline);

    return results;
}

async function getSoonestUpcoming(count) {
    // Build aggregation pipeline
    let aggregationPipeline = [
        { $match: { start: { $gte: new Date() } } }, // Must not be a past event
        { $sort: { start: 1 } }
    ];
    // If limiting
    if (count && count > 0) aggregationPipeline.push({ $limit: count });

    const results = await Event.aggregate(aggregationPipeline);

    return results;
}

async function getSearched(phrase) {
    // Build aggregation pipeline
    let aggregationPipeline = [
        { $match: { start: { $gte: new Date() } } }, // Must not be a past event
        { $sort: { start: 1 } }
    ];
    // get all events
    const events = await Event.aggregate(aggregationPipeline);

    let results = [];
    phraseStrings = phrase.split(" ");
    const regex = new RegExp(phrase, "i");

    for (const event of events) {
        if (
            regex.test(event.title) ||
            regex.test(event.description) ||
            regex.test(event.institution)
        ) results.push(event);
    }

    return results;
}

module.exports = {
    getMostRecent,
    getMostPopular,
    getRecommended,
    getSoonestUpcoming,
    getSearched,
}
