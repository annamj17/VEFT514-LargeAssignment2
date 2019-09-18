const collections = require('./collection')
const mongoDb = require('mongodb');
const MongoClient = mongoDb.MongoClient;

const arguments = process.argv.slice(2);
const connectionString = arguments[0];

const dbName = connectionString.split('/').slice(-1)[0];

(async () => {
    const client = await MongoClient.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const database = client.db(dbName);

    const arts = database.collection('arts');
    const artists = database.collection('artists');
    const customers = database.collection('customers');
    const auctions = database.collection('auctions');
    const auctionBids = database.collection('auctionBids');

    if (true) {
        console.log(await arts.find({}).toArray());
        console.log(await artists.find({}).toArray());
        console.log(await customers.find({}).toArray());
        console.log(await auctions.find({}).toArray());
        console.log(await auctionBids.find({}).toArray());
    }

    if (await auctionBids.countDocuments() === 0) {
        const result = await auctionBids.insertMany(await Promise.all(collections.auctionBids.map(async auctionBid => {
            const customer = collections.customers.find(c => c.id === auctionBid.customerId);
            const auction = collections.auctions.find(a => a.id === auctionBid.auctionId);
            const art = collections.arts.find(art => art.id === auction.artId);
            const artist = collections.artists.find(artist => artist.id === art.artistId);

            const customerResult = await customers.insertOne({
                name: customer.name,
                username: customer.username,
                email: customer.email,
                address: customer.address
            });

            const artistResult = await artists.insertOne({
                name: artist.name,
                nickname: artist.nickname,
                address: artist.address,
                memberSince: artist.memberSince
            });

            const artResult = await arts.insertOne({
                images: art.images,
                isAuctionItem: art.isAuctionItem,
                title: art.title,
                artistId: artistResult.insertedId,
                date: art.date,
                description: art.description
            });

            const auctionResult = await auctions.insertOne({
                artId: artResult.insertedId,
                minimumPrice: auction.minimumPrice,
                endDate: auction.endDate
            });

            return {
                auctionId: auctionResult.insertedId,
                customerId: customerResult.insertedId,
                price: auctionBid.price
            };
        })));

        console.log(result);
    }
})();