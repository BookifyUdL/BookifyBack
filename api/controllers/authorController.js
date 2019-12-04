const mongoose = require('mongoose');
const Author = require('../models/author.js');


exports.create_author = (req, res, next) => {
    console.log(req.file);
    const author = new Author({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name
    });
    author.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Author created successfully",
            createdAuthor: {
                _id: result._id,
                name: result.name,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/authors/' + result._id
                }

            }
        });

    })
    .catch(err => console.log(err));
}

exports.get_all_author = (req, res, next) => {
    Author
    .find()//Without parameters it will get all the options.
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                authors: results.map( result => {
                    return {
                        _id: result._id,
                        name: result.name,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/authors/' + result._id
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

exports.get_author_by_name = (req, res, next) => {
    const name = req.params.name;//params--> object with all the params we have.
    Author.find({"name": name})
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                book: doc,
                request: {
                    type: 'GET',
                    description: "GET_AUTHORS",
                    url: 'http://localhost:3000/authors/'
                }
            });
        } else {
            res.status(404).json({message: "No result found, for the name you've searched"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err});
    });
}

exports.get_author = (req, res, next) => {
    const authorId = req.params.authorId;//params--> object with all the params we have.
    Author.findById(authorId)
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                author: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_AUTHORS",
                    url: 'http://localhost:3000/authors/'
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
exports.update_author = (req, res, next) => {
    const id = req.params.authorId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; //This will give us an updated object.
    }
    Author.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Author information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/authors/" + id
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_author = (req, res, next) => {
    const id = req.params.authorId;
    Author.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Author deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/authors/",
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