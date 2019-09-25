const auctionService = () => {
    const { Auction, AuctionBid, Customer } = require('../data/db');
    const ArtService = require('./artService');

    const getAllAuctions = (cb, errorCb) => {
        Auction.find({}, function (err, auctions) {
            if (err) { errorCb(err); }
            cb(auctions);
        });
    };

    const getAuctionById = (id, cb, errorCb) => {
        Auction.findById(id, function (err, auctions) {
            if (err) { errorCb(err); }
            cb(auctions);
        });
    };

    const getAuctionWinner = (auctionId, cb, errorCb) => {
        AuctionBid.findById(auctionId, (err, auction) => {
            if (err) { errorCb(err); }
            else if (auction === null) {
                errorCb(err);
            }
            else if (auction.endDate >= Date.now) {
                errorCb(err);
            }
            else if (!auction.auctionWinner) {
                cb('This auction had no bids.');
            }
            else {
                Customer.findById(auction.auctionWinner, (customerError, customer) => {
                    if (customerError) {
                        errorCb(err);
                    }
                    else {
                        cb(customer);
                    }
                });
            }
        });
    };

    const createAuction = (auction, successCb, errorCb) => {
        const artId = auction.artId;
        ArtService.getAllArts({}, function (err, art) {
            if (err) { errorCb(err); }
            const checker = art.find(a => a._id == artId);
            if (checker instanceof Object) {
                if (checker.isAuctionItem) {
                    const auction = new Auction({
                        artId: artId,
                        minimumPrice: minimumPrice,
                        endDate: endDate
                    });
                    console.log('Error', err);
                    Auction.create(auction, function (err) {
                        if (err) { errorCb(err); }
                        else { successCb(auction); }
                    });
                }
            }
        });
    }

    const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
        // Your implementation goes here
    };

    const placeNewBid = (auctionId, customerId, price, cb, errorCb) => {
        Auction.findById(auctionId, function (err, auction) {
            if (!auction) { errorCb(send(status(404))); /* TODO: Handle 404 not found */ }
            else {
                Customer.findById(customerId, function (err, customer) {
                    if (!customer) { errorCb(send(status(404))); /* TODO: Handle 404 not found */ }
                    AuctionBid.findOne({ auctionId: auctionId }).sort('price').exec((err, highestBidder) => {
                        if (!highestBidder || price <= highestBidder.price) {
                            errorCb(send(status(412)));
                        } else if (auction.endDate > Date.now) {
                            errorCb(send(status(403)));
                        } else {
                            Auction.findOneAndUpdate({ '_id': auctionId }, { $set: { 'auctionWinner': highestBidder.customerId } }, function (err) {
                                if (err) { errorCb(err); }
                                else {
                                    const bid = new AuctionBid({
                                        auctionId: auctionId,
                                        customerId: customerId,
                                        price: price
                                    });

                                    AuctionBid.create(bid, function (err) {
                                        if (err) { errorCb(err); }
                                        cb(bid);
                                    });
                                }
                            });
                        }
                    });
                });
            }
        })
    };

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
