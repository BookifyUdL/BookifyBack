const mongoose = require('mongoose');
const Book = require('../models/book.js');


exports.create_book = (req, res, next) => {
    console.log(req.file);
    const book = new Book({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        summary: req.body.summary,
        _id: req.body._id,
        publisher: req.body.publisher,
        num_pages: req.body.num_pages,
        publication_date: req.body.publication_date,
        author: req.body.author,
        genre: req.body.genre,
        cover_image: req.body.cover_image
    });
    book.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                _id: result._id,
                title: result.title,
                summary: result.summary,
                _id: result._id,
                publisher: result.publisher,
                num_pages: result.num_pages,
                publication_date: result.publication_date,
                author: result.author,
                genre: result.genre,
                cover_image: result.cover_image,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/books/' + result._id
                }

            }//To confirm we got the correct product.
        });

    })
    .catch(err => console.log(err));
}


exports.get_all_books = (req, res, next) => {
    Book
    .find()//Without parameters it will get all the options.
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                books: results.map( result => {
                    return {
                        //book data
                        title: result.title,
                        summary: result.summary,
                        _id: result._id,
                        publisher: result.publisher,
                        num_pages: result.num_pages,
                        publication_date: result.publication_date,
                        author: result.author,
                        genre: result.genre,
                        cover_image: result.cover_image,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/books/' + result._id
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
exports.get_book_by_title = (req, res, next) => {
    const title = req.params.bookTitle;//params--> object with all the params we have.
    Book.findOne({projection: {bookTitle: title}}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
    })
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                book: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_BOOKS",
                    url: 'http://localhost:3000/books/'
                }
            });
        } else {
            res.status(404).json({message: "No result found, by the id you search"})
        }
    }) 
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err});
    });
}


exports.get_book_by_genre = (req, res, next) => { 
    const genre = req.params.bookGenre;//params--> object with all the params we have.
    Book.findOne({projection: {bookGenre: genre}}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
    })
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                book: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_BOOKS",
                    url: 'http://localhost:3000/books/'
                }
            });
        } else {
            res.status(404).json({message: "No result found, by the id you search"})
        }
    }) 
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err});
    });
}
exports.update_book = (req, res, next) => {
    const id = req.params.bookId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; //This will give us an updated object.
    }
    Book.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Book information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/books/" + id
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_book = (req, res, next) => {
    const id = req.params.bookId;
    Book.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Book deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/books/",
                body: {name: "String" , price: "Number"}
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