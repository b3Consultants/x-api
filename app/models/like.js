var mongoose = require('mongoose');

module.exports = mongoose.model('Like', {
    ip_address: {
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
