const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //Special type, that its a serial ID.
    email: { type: String,
        required: true,
        unique: true, //unique does not validate the values.
        //Email validation regex.
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }, 
    password: { type: String, required: true}

});

module.exports = mongoose.model('User', userSchema)