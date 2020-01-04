const mongoose = require('mongoose');
const Review = require('../models/review.js');

exports.create_review = (req, res, next) => {
    console.log(req.file);
    const review = new Review({
        _id: mongoose.Types.ObjectId(),
        stars: req.body.stars,
        feeling: req.body.feeling,
        user: req.body.user
    });
    review.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created review successfully",
            createdReview: {
                _id: result._id,
                stars: result.stars,
                feeling: result.feeling,
                user: result.user,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/reviews/' + result._id
                }

            }
        });
    })
    .catch(err => console.log(err));
}
exports.get_all_review = (req, res, next) => {
    Review
    .find()//Without parameters it will get all the options.
    .populate('feeling')
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                reviews: results.map( result => {
                    return {
                        _id: result._id,
                        stars: result.stars,
                        feeling: result.feeling,
                        user: result.user,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/reviews/' + result._id
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
}

exports.update_review_mobile = (req, res, next) => {
    const id = req.params.reviewId;
    Review.findByIdAndUpdate(id, 
        {
            stars: req.body.stars,
            feeling: req.body.feeling,
            user: req.body.user
        }, {new: true}) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Review information updated",
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

exports.get_review = (req, res, next) => {
    const reviewId = req.params.reviewId;//params--> object with all the params we have.
    Review.findById(reviewId)
    .populate('feeling')
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                review: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_REVIEWS",
                    url: 'http://localhost:3000/reviews/'
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
exports.update_review = (req, res, next) => {
    const id = req.params.reviewId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; //This will give us an updated object.
    }
    Review.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Review information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/reviews/" + id
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_review = (req, res, next) => {
    const id = req.params.reviewId;
    Review.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Review deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/reviews/",
                body: {stars: "Number", feeling: "String array"}
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