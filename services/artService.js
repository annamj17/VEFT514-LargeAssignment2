const artService = () => {
    const Art = require('../data/db');
    const getAllArts = (cb, errorCb) => {
        Art.Art.find({}, function(err, arts) {
            if(err) { errorCb(err); }
            cb(arts);
        })
    };

    const getArtById = (id, cb, errorCb) => {
        Art.Art.findById(id, function(err, arts) {
            if (err) { errorCb(err); }
            cb(arts);
        })
    };

    const createArt = (art, successCb, errorCb) => {
        Art.Art.create(art, function(err, result) {
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
