const Schema = require('mongoose').Schema;

module.exports = new Schema({
    title: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now, required: true },
    images: { type: [String], createIndexes: true },
    description: String,
    isAuctionItem: { type: Boolean, default: false }
});
