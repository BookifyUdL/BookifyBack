const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //Special type, that its a serial ID.
    firebaseId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    userPicture: {
        type: String
    },
    premium:{
        type: Boolean,
        default: false
    },
    achievements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement'
    }],
    library: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    read_book: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    reading_book: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    interested_book: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    email: { 
        type: String,
        required: true,
        unique: true, //unique does not validate the values.
        //Email validation regex.
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    premium: {
        type: Boolean,
        default: false
    }


});

module.exports = mongoose.model('User', userSchema);
