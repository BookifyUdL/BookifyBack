const mongoose = require('mongoose');
const Genre = require('../models/genre.js');


exports.create_genre = (req, res, next) => {
    console.log(req.file);
    const genre = new Genre({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name
    });
    genre.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created genre successfully",
            createdGenre: {
                _id: result._id,
                name: result.name,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/genres/' + result._id
                }

            }//To confirm we got the correct product.
        });
    })
    .catch(err => console.log(err));
}

exports.get_all_genres = (req, res, next) => {
    Genre
    .find()//Without parameters it will get all the options.
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                genres: results.map( result => {
                    return {
                        _id: result._id,
                        name: result.name,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/genres/' + result._id
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

exports.get_genre = (req, res, next) => {
    const genreId = req.params.genreId;//params--> object with all the params we have.
    Genre.findById(genreId)
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                genre: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_GENRES",
                    url: 'http://localhost:3000/genres/'
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

exports.update_genre = (req, res, next) => {
    const id = req.params.genreId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; //This will give us an updated object.
    }
    Genre.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Genre information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/genres/" + id
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_genre = (req, res, next) => {
    const id = req.params.genreId;
    Genre.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Genre deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/genres/",
                body: {name: "String"}
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