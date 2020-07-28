const mongoose = require('mongoose');

const clubNames = mongoose.Schema({
    name: {type: String, default: ''},
    country: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    fans: [{//object array that contains the user details who have added a particular club as favourite
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }]
});

module.exports = mongoose.model('Club', clubNames);