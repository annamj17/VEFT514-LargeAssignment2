const artService = () => {
    const { Art, Artist } = require('../data/db');
    
    const getAllArts = (cb, errorCb) => {
        Art.find({}, function(err, arts) {
            if(err) { errorCb(500, 'database error occurred'); }
            cb(arts);
        })
    };

    const getArtById = (id, cb, errorCb) => {
        Art.findById(id, function(err, art) {
            if (err) { errorCb(500, 'database error occurred'); }
            else if (art === null) { errorCb(404, 'Id was not found'); }
            cb(art);
        })
    };

    const createArt = (art, successCb, errorCb) => {
        Artist.findById(art.artistId, function(err, artist) {
            if (err) { errorCb(500, 'database error occurred'); }
            else {
                if (artist === null) { errorCb(400, 'Bad request, check formatting'); }
                Art.create(art, function (err, result) {
                    if (err) { errorCb(400, 'Bad request, check formatting'); }
                    else { successCb(result); }
                });
            }
        });
    };

    return {
        getAllArts,
        getArtById,
        createArt
    };
};

module.exports = artService();
