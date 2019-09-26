const customerService = () => {
    const { Customer, AuctionBid } = require('../data/db');
    
    const getAllCustomers = (cb, errorCb) => {
        Customer.find({}, function (err, customers) {
            if (err) { errorCb(500, 'database error occurred'); }
            cb(customers);
        });
    };

    const getCustomerById = (id, cb, errorCb) => {
        Customer.findById(id, function (err, customer) {
            if (err) { errorCb(500, 'database error occurred'); }
            else if (customer === null) { errorCb(404, 'Id was not found'); }
            cb(customer);
        });
    };

    const getCustomerAuctionBids = (customerId, cb, errorCb) => {
        AuctionBid.find({ 'customerId': customerId }, function (err, auctionBids) {
            if (err) { errorCb(500, 'database error occurred'); }
            else if (auctionBids === null) { errorCb(404, 'Id was not found'); }
            cb(auctionBids);
        });
    };

    const createCustomer = (customer, cb, errorCb) => {
        Customer.create(customer, function (err, result) {
            if (err) { errorCb(500, 'database error occurred'); }
            else if (customer === null) { errorCb(400, 'Bad request, check formatting') }
            cb(result);
        });
    };

    return {
        getAllCustomers,
        getCustomerById,
        getCustomerAuctionBids,
        createCustomer
    };
};

module.exports = customerService();
