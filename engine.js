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
        { $sort: { created: -1 } }
    ]
    // If limiting
    if (count && count > 0) aggregationPipeline.push({ $limit: count });

    const results = await Event.aggregate(aggregationPipeline);

    return results;
}

async function getMostPopular(count) {
    return [];
}

async function getReccomended(user, count) {
    return [];
}

async function getSoonestUpcoming(count) {
    // Build aggregation pipeline
    let aggregationPipeline = [
        { $sort: { start: -1 } }
    ];
    // If limiting
    if (count && count > 0) aggregationPipeline.push({ $limit: count });

    const results = await Event.aggregate(aggregationPipeline);

    return results;
}

async function getSearched(phrase) {
    return [];
}

module.exports = {
    getMostRecent,
    getMostPopular,
    getReccomended,
    getSoonestUpcoming,
    getSearched,
}
