const auctionService = () => {
    const Auction = require('../data/db');
    const getAllAuctions = (cb, errorCb) => {
        Auction.Auction.find({}, function(err, auctions) {
            if(err) { errorCb(err); }
            cb(auctions);
        })
    };

    const getAuctionById = (id, cb, errorCb) => {
        Auction.Auction.findById(id, function(err, auctions) {
            if (err) { errorCb(err); }
            cb(auctions);
        })
    };

    const getAuctionWinner = (auctionId, cb, errorCb) => {
        Auction.Auction.findById(auctionId, function(err, auctions) {
            if(err) { errorCb(err); }
            cb(auctions); 
        })
    };

	const createAuction = (auction, successCb, errorCb) => {
        Auction.Auction.create(auction, function(err, result) {
            if (err) { errorCb(err); }
            else { successCb(result); }
          });
    };

	const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
        // Your implementation goes here
    };

	const placeNewBid = (auctionId, customerId, price, cb, errorCb) => {
		/*Auction.Auction.create(auction, function(err, result) {
            if (err) { errorCb(err); }
            else { successCb(result); }
          });*/
	}

    return {
        getAllAuctions,
        getAuctionById,
        getAuctionWinner,
		createAuction,
		getAuctionBidsWithinAuction,
		placeNewBid
    };
};

module.exports = auctionService();
