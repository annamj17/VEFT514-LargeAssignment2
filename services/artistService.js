const artistService = () => {
    const Artist = require('../data/db');
    const getAllArtists = (cb, errorCb) => {
        Artist.Artist.find({}, function(err, artist) {
            if(err) { errorCb(err); }
            cb(artist);
        })
    };

    const getArtistById = (id, cb, errorCb) => {
        // Your implementation goes here
    };

    const createArtist = (artist, cb, errorCb) => {
        // Your implementation goes here
    };

    return {
        getAllArtists,
        getArtistById,
        createArtist
    };
};

module.exports = artistService();
