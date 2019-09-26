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

    const getAuctionWinner = (auctionId, cb, errorCb, err409) => {
        Auction.findById(auctionId, (err, auction) => {
            if (err) { errorCb(err); }
            else if (auction === null) {
                errorCb(err);
            }
            else if (auction.endDate >= Date.now) {
                err409(err);
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

    const createAuction = (auction, cb, err, err404, err409) => {
        // check if external id exists
        Art.findById(auction.artId, (error, art) => {
            var today = new Date();
            var endDateDate = new Date(auction.endDate);
            if (error) err404(error);
            else if (!art) { err404(error) }
            else if (!art.isAuctionItem) { err(error) }
            else if (today > endDateDate)  { err409(error); }
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

    const placeNewBid = (auctionId, customerId, price, cb, errorCb,  err412, err403, err404) => {
        Auction.findById(auctionId, function (error, auction) {
            if (!auction) { err404(error); }//{ errorCb(send(status(404))); /* TODO: Handle 404 not found */ }
            else {
                Customer.findById(customerId, function (error, customer) {
                    if (!customer) { err404(error); 
                    console.log(error);
                    }//{ errorCb('Kjani'); /* TODO: Handle 404 not found */ }
                    
                    AuctionBid.findOne({ auctionId: auctionId }).sort('price').exec((error, highestBidder) => {
                        if (!highestBidder || price <= highestBidder.price) {
                            //console.log(highestBidder);
                            //console.log(error);
                            console.log('kjani2');
                            { err412(error); }
                        } else if (auction.endDate > Date.now) {
                           console.log('kjani3');
                           console.log(error);
                            { err403(error); }
                            console.log(error);
                        } else {
                            Auction.findOneAndUpdate({ '_id': auctionId }, { $set: { 'auctionWinner': highestBidder.customerId } }, function (error) {
                                if (error) { errorCb(error); }
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
