const mongoose = require('mongoose');
const Comment = require('../models/comment.js');

exports.create_comment = (req, res, next) => {
    console.log(req.file);
    const comment = new Comment({
        _id: mongoose.Types.ObjectId(),
        message: req.body.message,
        //book: req.body.book,
        user: req.body.user,
        user_liked: req.body.user_liked,
        uri: req.body.uri,
        comment_type: req.body.comment_type,
        subreviews: req.body.subreviews,
        is_sub: req.body.is_sub,
    });
    comment.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Comment created successfully",
            createdComment: {
                _id: req.body._id,
                message: req.body.message,
                //book: result.book,
                user: req.body.user,
                user_liked: req.body.user_liked,
                uri: req.body.uri,
                comment_type: req.body.comment_type,
                subreviews: req.body.subreviews,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/comments/' + result._id
                }

            }
        });
    })
    .catch(err => console.log(err));
}

exports.get_all_comment = (req, res, next) => {
    Comment
    .find({is_sub: false})//Without parameters it will get all the options.
    .populate('user')
    .populate('user_liked')
    .populate('subreviews')
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                comments: results.map( result => {
                    return {
                        _id: result._id,
                        message: result.message,
                        //book: result.book,
                        user: result.user,
                        user_liked: result.user_liked,
                        uri: result.uri,
                        comment_type: result.comment_type,
                        subreviews: result.subreviews,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/comments/' + result._id
                        }
                    }
                })
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
}

exports.get_comment = (req, res, next) => {
    const commentId = req.params.commentId;//params--> object with all the params we have.
    Comment.findById(commentId)
    .populate('user')
    .populate('user_liked')
    .populate('subreviews')
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                comment: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_COMMENTS",
                    url: 'http://localhost:3000/comments/'
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
}

exports.update_comment_mobile = (req, res, next) => {
    const id = req.params.commentId;
    Comment.findByIdAndUpdate(id,
        {
            message: req.body.message,
            user: req.body.user,
            user_liked: req.body.user_liked,
            uri: req.body.uri,
            comment_type: req.body.comment_type,
            subreviews: req.body.subreviews

        }, {new: true}) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Genre information updated",
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

exports.update_comment = (req, res, next) => {
    const id = req.params.commentId;
    const updateOps = {};
    Comment.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Comment information updated",
            request:{
                type: "GET",
                url: "http://localhost:3000/comments/" + id
            }
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.delete_comment = (req, res, next) => {
    const id = req.params.commentId;
    Comment.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Comment deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/comments/",
                body: {
                    message: "String",
                    //book: "Book",
                    user: "User",
                    user_liked: "User Array",
                    uri: "String",
                    comment_type: "Number",
                    subreviews: "Review Array"
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}
