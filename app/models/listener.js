var mongoose = require('mongoose');

module.exports = mongoose.model('Listener', {
    name: {
        type: String,
        default: 'noname'
    },
    email: {
        type: String,
        default: ''
    },
    picture: {
        type: String
    },
    user_id: {
        type: String
    }
});
