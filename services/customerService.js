const customerService = () => {
    const Customer = require('../data/db');
    const getAllCustomers = (cb, errorCb) => {
        Customer.Customer.find({}, function(err, customers) {
            if(err) { errorCb(err); }
            cb(customers);
        })
    };

    const getCustomerById = (id, cb, errorCb) => {
        // Your implementation goes here
    };

    const getCustomerAuctionBids = (customerId, cb, errorCb) => {
        // Your implementation goes here
    };

	const createCustomer = (customer, cb, errorCb) => {
        // Your implementation goes here
    };

    return {
        getAllCustomers,
        getCustomerById,
        getCustomerAuctionBids,
		createCustomer
    };
};

module.exports = customerService();
