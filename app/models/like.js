var mongoose = require('mongoose');

module.exports = mongoose.model('like', {
    token: {
        type: String,
    },
    song: {
        type: String,

    },
    timestamp: {
        type: Date,
    },
    liked:{
        type:String
    }
})
