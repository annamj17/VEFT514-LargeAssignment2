const artService = () => {
    const { Art } = require('../data/db');
    const getAllArts = (cb, errorCb) => {

        Art.find({}, function(err, arts) {
            if(err) { errorCb(err); }
            cb(arts);
        })
    };

    const getArtById = (id, cb, errorCb) => {
        Art.findById(id, function(err, arts) {
            if (err) { errorCb(err); }
            cb(arts);
        })
    };

    const createArt = (art, successCb, errorCb) => {
        Art.create(art, function(err, result) {
            if (err) { errorCb(err); }
            else { successCb(result); }
        });
    };

    return {
        getAllArts,
        getArtById,
        createArt
    };
};

module.exports = artService();
