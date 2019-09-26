const artistService = () => {
    const { Artist } = require('../data/db');

    const getAllArtists = (cb, errorCb) => {
        Artist.find({}, function (err, artist) {
            if (err) { errorCb(500, 'database error occurred'); }
            cb(artist);
        })
    };

    const getArtistById = (id, cb, errorCb) => {
        Artist.findById(id, function (err, artist) {
            if (err) { errorCb(500, 'database error occurred'); }
            else if (artist === null) { errorCb(404, 'Id was not found'); }
            cb(artist);
        });
    };

    const createArtist = (artist, cb, errorCb) => {
        Artist.create(artist, function (err, result) {
            if (err) { errorCb(500, 'database error occurred'); }
            else if (artist === null) { errorCb(400, 'Bad request, check formatting') }
            cb(result);
        });
    };

    return {
        getAllArtists,
        getArtistById,
        createArtist
    };
};

module.exports = artistService();
