var mongoose = require('mongoose');

module.exports = mongoose.model('TempUsers', {
    email: {
        type: String,
        default: 'noemail'
    },
    name: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: 'nopass'
    },
    method: {
        type: String,
        enum: ['FACEBOOK', 'GOOGLE', 'WEB_REGISTER']
    },
    token: {
        type: String,
    }
})
