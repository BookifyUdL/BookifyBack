const mongoose = require('mongoose');
const Admins = require('../models/admin');
const Admin = mongoose.model('Admin');

const passport = require('passport');

exports.authenticate = function(req, res, next) {
    passport.authenticate('local', (err, username, info) => {
        if(err){
            console.log(err);
            res.status(402).json(info);
            return (err);
        }

        if(username) {
            const user = username;
            user.token = username.generateJWT();
            res.json({ user: user.toAuthJSON() });
        } else {
            res.status(401).json(info);
        }
    })(req, res, next);
};

exports.find = function(req, res) {
    Admin.findOne({_id: req.params.id}).exec(function (err, user) {
        res.json(user);
    })
};

exports.init = function(req, res) {

    const admin = new Admin();
    admin.email = "admin@admin";
    admin.name = 'admin';
    admin.setPassword("root");

    let deleted = false;
    Admin.remove({email: admin.email})
        .then((docs) => {
            if(docs)
                deleted = true;
        });

    admin.save()
        .catch( error =>{
            console.log(error);
            res.status(500).send();
        } )
        .then( result => {
            res.status(200).json({user: result, deleted: deleted});
        } );
};
