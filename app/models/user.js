var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
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
    picture: {
        type: String,
        default: ''
    },
    method: {
        type: String,
        enum: ['FACEBOOK', 'GOOGLE', 'WEB_REGISTER']
    },
    amount_listened: {
        type: String,
        default: '0'
    },
    api_id:{
        type:String
    }
})
