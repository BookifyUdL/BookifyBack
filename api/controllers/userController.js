const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/*TODO modify this controller (_maybe)*/

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                //409 Conflict.
                //422 Unprocessable entity.
                return res.status(409).json({
                    message: "User with that mail exists."
                });
            } else {
                //Encrypts the password. Adding string at the start and the end of the plain text and then hashes it.
/*                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {*/
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            firebaseId: req.body.firebaseId,
                            name: req.body.name,
                            userPicture: req.body.userPicture,
                            premium: req.body.premium,
                            achievements: req.body.achievements,
                            library: req.body.library,
                            read_book: req.body.read,
                            interested_book: req.body.interested_book,
                            genres: req.body.genres,
                            email: req.body.email,
                            //password: hash
                        });
                        user.save()
                        .then( result => {
                            console.log(result);
                            res.status(201).json({
                                message: "User created correctly"
                            });
                        })
                        .catch( err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });    
                    }
                });
            }
        /*});    
}*/

exports.user_login = (req,res,next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1 ){
            return res.status(401).json({
                message: "Auth failed"
            });
        }

        if(req.body.firebaseId === user[0].firebaseId){
            const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id,
                },
                process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                }
                );
                
                return res.status(200).json({
                    message:"Auth successful",
                    token: token
                });
        } else {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        /*bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (result) {
                const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id,
                },
                process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message:"Auth successful",
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth failed"
            });
        })*/
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.user_delete = (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "User deleted",
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}