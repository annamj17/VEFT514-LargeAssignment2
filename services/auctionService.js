const auctionService = () => {
    const { Auction, AuctionBid, Customer, Art } = require('../data/db');

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

	const createAuction = (auction, successCb, errorCb) => {
        Art.findById(auction.artId, (err, art) => {
            if (err) {
                errorCb(err);
                console.log('Fyrsti error');}
 
            else if (!art) {
                errorCb(err, );
                console.log('Núna ertu hér og art er ekki til');}

            else if (!art.isAuctionItem) {
                console.log(art.isAuctionItem);
                errorCb(err);
                console.log('Núna ertu hér og isAuctionItem er ekki til');}

            else {
                console.log('Núna ætlum við að búa til auction :)');
                Auction.create({
                    artId: auction.artId,
                    minimumPrice: auction.minimumPrice,
                    endDate: auction.endDate
                    }, error => { 
                    if(error) err(error); 
                    else successCb(auction); 
                }
            )};
        })
    };

	const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
        AuctionBid.find({ 'auctionId': auctionId }, function (err, auctionBids) {
            if (err) { errorCb(err); }
            cb(auctionBids);
        });    
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
                                    successCb(bid);
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
