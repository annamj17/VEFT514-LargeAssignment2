const auctionService = () => {
    const { Auction, AuctionBid, Customer } = require('../data/db');

    const getAllAuctions = (cb, errorCb) => {
        Auction.find({}, function(err, auctions) {
            if(err) { errorCb(err); }
            cb(auctions);
        })
    };

    const getAuctionById = (id, cb, errorCb) => {
        Auction.findById(id, function(err, auctions) {
            if (err) { errorCb(err); }
            cb(auctions);
        })
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
        Auction.create(auction, function(err, result) {
            if (err) { errorCb(err); }
            else { successCb(result); }
          });
    };

	const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
        // Your implementation goes here
    };

	const placeNewBid = (auctionId, customerId, price, cb, errorCb) => {
        Auction.findById(auctionId, function(err, auction) {
            console.log('Auction', auction);
            console.log('Error', err);
            if (!auction) { errorCb(err); /* TODO: Handle 404 not found */ }
            else {
            Customer.findById(customerId, function (err, customer) {
                if (!customer) { errorCb(err); /* TODO: Handle 404 not found */ }
                AuctionBid.findOne({ auctionId: auctionId }).sort('price').exec((err, highestBidder) => {
                    console.log('HighestBid: ', highestBidder);
                    if (!highestBidder || price <= highestBidder.price) {
                        /* TODO: Handle error */
                        errorCb('Kjani');
                    } else if (auction.endDate > Date.now) {
                        /* TODO: Handle error */
                        errorCb('Kjani2');
                    } else {
                        console.log('HERNA')
                        Auction.findOneAndUpdate({ '_id': auctionId }, { $set: { 'auctionWinner': highestBidder.customerId } }, function(err) {
                            console.log('NewHighestBid: ', highestBidder.customerId);
                            if (err) { errorCb(err); }
                            else {
                                const bid = new AuctionBid({
                                    auctionId: auctionId,
                                    customerId: customerId,
                                    price: price
                                });

                                AuctionBid.create(bid, function(err) {
                                    console.log('BIDINDEX', bid);
                                    if (err) { errorCb(err); }
                                    console.log('ERROR', err);
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
