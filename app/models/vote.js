var mongoose = require('mongoose');

module.exports = mongoose.model('vote', {
    token: {
        type: String,
    },
    song: {
        type: String,
    },
    timestamp: {
        type: Date,
    },
    voted:{
        type:String
    }
})
