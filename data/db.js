const mongoose = require('mongoose');
const artSchema = require('../schemas/art');
const artistSchema = require('../schemas/artist');
const auctionSchema = require('../schemas/auction');
const auctionBidSchema = require('../schemas/auctionBid');
const customerSchema = require('../schemas/customer');

const connection = mongoose.createConnection('mongodb+srv://Anna:Abc1234@cluster0-hkoga.mongodb.net/mansion_de_subastas', {
    useNewUrlParser: true
}, () => {
    console.log('Connected to mongo db server');
});

module.exports = {
    Art: connection.model('Art', artSchema, 'arts'),
    Artist: connection.model('Artist', artistSchema, 'artists'),
    Auction: connection.model('Auction', auctionSchema, 'auctions'),
    AuctionBid: connection.model('AuctionBid', auctionBidSchema, 'auctionBids'),
    Customer: connection.model('Customer', customerSchema, 'customers')
};
