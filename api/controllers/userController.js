const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

exports.update_user_mobile = (req, res, next) => {
    const id = req.params.userId;
    User.findByIdAndUpdate(id, 
        {firebaseId: req.body.firebaseId,
        name: req.body.name,
        userPicture: req.body.userPicture,
        publication_date: req.body.publication_date,
        premium: req.body.premium,
        achievements: req.body.achievements,
        cover_image: req.body.cover_image,
        library: req.body.library,
        read_book: req.body.read_book,
        reading_book: req.body.reading_book,
        interested_book: req.body.interested_book,
        genres: req.body.genres,
        email: req.body.email
        }, {new: true}) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "User information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/users/" + id
                }
            });
            res.send(result);
        })
        .catch( err => {
            console.log(err);
        });
}

exports.update_user = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; //This will give us an updated object.
    }
    User.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "User information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/users/" + id
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.get_user = (req, res, next) => {
    const userId = req.params.userId;//params--> object with all the params we have.
    User.findById(userId)
        .populate('achievements')
        .populate('genres')
        .populate('read_book')
        .populate('reading_book')
        .populate('interested_book')
        .populate('library')
        .exec()
        .then(doc => {
            console.log("From Database: " + doc);
            if(doc){
                res.status(200).json({
                    genre: doc,
                    request: {
                        type: 'GET',
                        description: "GET_ALL_USERS",
                        url: 'http://localhost:3000/users/'
                    }
                });
            } else {
                res.status(404).json({message: "No result found, for the id you've searched"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error:err});
        });
};

exports.get_user_by_email = (req, res, next) => {
    const email = req.params.email;//params--> object with all the params we have.
    User.find({"email": email})
        .populate('achievements')
        .populate('genres')
        .populate('read_book')
        .populate('reading_book')
        .populate('interested_book')
        .populate('library')
        .exec()
        .then(doc => {
            console.log("From Database: " + doc);
            if(doc){
                res.status(200).json({
                    genre: doc,
                    request: {
                        type: 'GET',
                        description: "GET_ALL_USERS",
                        url: 'http://localhost:3000/users/'
                    }
                });
            } else {
                res.status(404).json({message: "No result found, for the email you've searched"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error:err});
        });
};


exports.get_all_users = (req, res, next) => {
    console.log(req);
    User
        .find()//Without parameters it will get all the options.
        .populate('achievements')
        .populate('genres')
        .populate('read_book')
        .populate('reading_book')
        .populate('interested_book')
        .populate('library')
        .exec()
        .then(results => {
            if(results.length >= 0){
                const response = {
                    count: results.length,
                    users: results.map( result => {
                        return {
                            _id: result._id,
                            name: result.name,
                            firebaseId: result.firebaseId,
                            userPicture: result.userPicture,
                            premium: result.premium,
                            achievements: result.achievements,
                            library: result.library,
                            read_book: result.read_book,
                            reading_book: result.reading_book,
                            interested_book: result.interested_book,
                            genres: result.genres,
                            email: result.email,
                            premium: result.premium,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/' + result._id
                            }
                        }
                    })//map --> map it into a new array.
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "No entries found"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

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
                            read_book: req.body.read_book,
                            reading_book: req.body.reading_book,
                            interested_book: req.body.interested_book,
                            genres: req.body.genres,
                            email: req.body.email,
                            //password: hash
                        });
                        user.save()
                        .then( result => {
                            console.log(result);
                            res.status(201).json({
                                _id: result._id,
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
