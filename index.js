// Here the web service should be setup and routes declared
const artService = require('./services/artService');
const artistService = require('./services/artistService');
const auctionService = require('./services/auctionService');
const customerService = require('./services/customerService');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Tekur req body og umbreytir yfir i json
app.use(bodyParser.json());


/***** ARTS *****/

// http://localhost:3000/api/arts   [GET]
// Gets all arts
app.get('/api/arts', function(req, res) {
    artService.getAllArts(function (arts) {
        return res.json(arts);
    })
});

// http://localhist:3000/api/1   [GET]
// Gets an art by id
app.get('/api/arts/:artId', function(req, res) {
    const artId = req.params.artId;
    return res.send(artId);
});

// http://localhost:3000/api/arts   [POST]
// Creates a new art
app.post('/api/arts', function(req, res) {
    return res.json(req.body);
});

/***** ARTISTS *****/

// http://localhost:3000/api/artists   [GET]
// Gets all artists
app.get('/api/artists', function(req, res) {
    return res.json({ hi: 'hi' });
});

// http://localhost:3000/api/artists/1   [GET]
// Gets an artist by id
app.get('/api/artists/:artistId', function(req, res) {
    const artistId = req.params.artistId;
    return res.send(artistId);
});

// http://localhost:3000/api/artists   [POST]
// Creates a new artist
app.post('/api/artists', function(req, res) {
    return res.json(req.body);
});

/***** CUSTOMERS *****/

// http://localhost:3000/api/customers   [GET]
// Gets all customers
app.get('/api/customers', function(req, res) {
    return res.json({ hi: 'hi' });
});

// http://localhost:3000/api/customers/1   [GET]
// Gets a customer by id
app.get('/api/customers/:customerId', function(req, res) {
    const cumstomerId = req.params.cumstomerId;
    return res.send(cumstomerId);
});

// http://localhost:3000/api/customers   [POST]
// Creates a new customer
app.post('/api/customers', function(req, res) {
    return res.json(req.body);
});

// http://localhost:3000/api/customers/1/auction-bids   [GET]
// Gets all auction bids associated with a customer
app.get('/api/customers/:customerId/auction-bids', function(req, res) {

});

/***** AUCTIONS *****/

// http://localhost:3000/auctions/1   [GET]
// Gets all auctions

app.get('/api/auctions', function(req, res) {
    return res.json({ hi: 'hi' });
});

// http://localhost:3000/api/auctions/1   [GET]
// Gets an auction by id

app.get('/api/auctions/:auctionId', function(req, res) {
    const auctionId = req.params.auctionId;
    return res.send(auctionId);
});

// http://localhost:3000/api/auctions/1/winner   [GET]
//  Gets the winner of the auction
app.get('/api/auctions/:auctionId/winner', function(req, res) {

});

// http://localhost:3000/api/auctions   [POST]
// Create a new auction
app.post('/api/auctions', function(req, res) {

});

// http://localhost:3000/api/auctions/1/bids   [GET]
// Gets all auction bids associated with an auction

app.get('/api/auctions/auctionId/bids', function(req, res) {

});

// http://localhost:3000/api/auctions/1/bids   [POST]
// Creates a new auction bid
app.post('/api/auctions/auctionId/bids', function(req, res) {

});



// http://localhost:3000
app.listen(3000, function() {
    console.log('Server is listening on port 3000');
}); 