var mongoose = require('mongoose');

module.exports = mongoose.model('Like', {
    user_id: {
        type: String,
    },
    song: {
        type: String,

    },
    time: {
        type: Date,
    },
    liked:{
        type:String
    }
})
