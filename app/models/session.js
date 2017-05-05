var mongoose = require('mongoose');

module.exports = mongoose.model('Session', {
    email: {
        type: String,
        default: 'noemail'
    },
    token: {
        type: String,
        default: ''
    },
    last_activity: {
        type: Date
    },
    picture: {
        type: String
    },
    method: {
        type: String,
        enum: ['FACEBOOK', 'GOOGLE', 'WEB_REGISTER']
    },
    user_id: {
        type: String,
    }

})
