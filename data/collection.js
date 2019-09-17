// Spunring um ad bua bara til 5 af hverju

const arts = [
    {
        images: [
            'http://example.com/profile.jpg',
            'http://example.com/profile.jpg'
        ],
        isAuctionItem: false,
        id: 1,
        title: 'Mumin',
        artistId: 1,
        date: Date.now,
        description: 'Painting of the mumin family'
    },
];

const artists = [
    {
        id: 1,
        name: 'Van Helsing',
        nickname: 'The Van',
        address: 'Bandera South Dakota',
        memberSince: Date.now
    },
];

const customers = [
    {
        id: 1,
        name: 'Customer 1',
        username: 'Customer1',
        email: 'customer1@gmail.com',
        address: 'Customer street 1'
    },
];

const auctions = [
    {
        id: 1,
        artId: '1',
        minimumPrice: 10,
        endDate: Date.now,
        auctionWinner: ''
    },
];

const auctionsBid = [
    {
        id: 1,
        auctionId: 1,
        customerId: 1,
        price: 20
    },
];

module.exports = {
    arts,
    artists,
    customers,
    auctions,
    auctionsBid
};
