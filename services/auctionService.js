const auctionService = () => {

    const { Auction, AuctionBid, Customer, Art } = require('../data/db');

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
        Auction.findById(auctionId, (err, auction) => {
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

    const createAuction = (auction, cb, err) => {
        // check if external id exists
        Art.findById(auction.artId, (error, art) => {
            console.log("art.date:", art.date);
            var today = new Date();
            console.log("today", today);
            var endDateDate = new Date(auction.endDate);
            if (error) err(error);
            else if (!art) { console.log("Bjani"); }
            else if (!art.isAuctionItem) { console.log('The art being put up for auction is not an auction item'); }
            else if (today >= endDateDate) { console.log('there is an ongoing auction currently for this art, art.date', auction.endDate, 'today', today); }
            else {
                Auction.create({
                    artId: auction.artId,
                    minimumPrice: auction.minimumPrice,
                    endDate: auction.endDate
                }, error => { if (error) err(error); else cb(true); }
                );
            }
        });
    };

    const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
        AuctionBid.find({ 'auctionId': auctionId }, function (err, auctionBids) {
            if (err) { errorCb(err); }
            cb(auctionBids);
        });
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
        });
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
