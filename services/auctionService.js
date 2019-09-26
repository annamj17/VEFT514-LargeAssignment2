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
            if (err) { errorCb(500, 'database error occurred'); }
            else if (auction === null) { errorCb(404, 'not found'); }
            else if (auction.endDate >= Date.now) {  errorCb(409, 'Auction is not finished'); }
            else if (!auction.auctionWinner) { cb('This auction had no bids.'); }
            else {
                Customer.findById(auction.auctionWinner, (customerError, customer) => {
                    if (customerError) { errorCb(err); }
                    else {
                        cb(customer);
                    }
                });
            }
        });
    };

    const createAuction = (auction, cb, err, err404, err409) => {
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
            if(err) { errorCb(500, 'database error occurred'); }
            //if (err) { errorCb(err); }
            cb(auctionBids);
        });
    };

    const placeNewBid = (auctionId, customerId, price, cb, errorCb) => {
        Auction.findById(auctionId, function (err, auction) {
            if(err) { errorCb(500, 'database error occurred'); }
            else if (!auction) { errorCb(404, 'Auction not found'); }
            else {
                Customer.findById(customerId, function (error, customer) {
                    if (!customer) { errorCb(404, 'Customer not found'); }
                    AuctionBid.findOne({ auctionId: auctionId }).sort('price').exec((error, highestBidder) => {
                        if (!highestBidder || price <= highestBidder.price) {
                            { errorCb(412, 'the price is lower than the minimum price'); }
                        } else if (auction.endDate > Date.now) {
                            { errorCb(403, 'The auction has already passed its end date'); }
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
