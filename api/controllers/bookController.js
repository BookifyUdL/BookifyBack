const mongoose = require('mongoose');
const Book = require('../models/book.js');


exports.create_book = (req, res, next) => {
    console.log(req.file);
    const book = new Book({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        summary: req.body.summary,
        num_page: req.body.num_page,
        publication_date: req.body.publication_date,
        author: req.body.author,
        genre: req.body.genre,
        cover_image: req.body.cover_image,
        comments: req.body.comments,
        rating: req.body.rating,
        num_rating: req.body.num_rating,
        is_new: req.body.is_new,
    });
    book.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Book created successfully",
            createdBook: {
                _id: result._id,
                title: result.title,
                summary: result.summary,
                _id: result._id,
                num_pages: result.num_pages,
                publication_date: result.publication_date,
                author: result.author,
                genre: result.genre,
                cover_image: result.cover_image,
                comments: result.comments,
                rating: result.rating,
                num_rating: result.num_rating,
                is_new: result.is_new,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/books/' + result._id
                }

            }
        });

    })
    .catch(err => console.log(err));
}


exports.get_all_books = (req, res, next) => {
    Book
    .find()//Without parameters it will get all the options.
    .populate('author')
    .populate('genre')
    .populate('comments')
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
                        num_pages: result.num_pages,
                        publication_date: result.publication_date,
                        author: result.author,
                        genre: result.genre,
                        cover_image: result.cover_image,
                        comments: result.comments,
                        rating: result.rating,
                        num_rating: result.num_rating,
                        is_new: result.is_new,
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

exports.get_book = (req, res, next) => {
    const bookId = req.params.bookId;//params--> object with all the params we have.
    Book.findById(bookId)
    .populate('author')
    .populate('genre')
    .populate('comments')
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
            res.status(404).json({message: "No result found, for the id you've searched"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err});
    });
}

exports.get_book_by_title = (req, res, next) => {
    const title = req.params.bookTitle;//params--> object with all the params we have.
    Book.find({"title": title})
    .populate('author')
    .populate('genre')
    .populate('comments')
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
            res.status(404).json({message: "No result found, for the id you've searched"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err});
    });
}


exports.get_book_by_genre = (req, res, next) => {
    const genre = req.params.bookGenre[0];//params--> object with all the params we have.
    Book.find({"genre": genre})
    .populate('author')
    .populate('genre')
    .populate('comments')
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
            res.status(404).json({message: "No result found, for the id you've searched"})
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
                body: {
                    title: "String",
                    summary: "String",
                    num_pages: "Number",
                    publication_date: "Date",
                    author: "Author Array",
                    genre: "Genre Array",
                    cover_image: "String",
                    comments: "Comment Array",
                    is_new: "Boolean, false by default",
                    num_rating: "Number, 0 by default",
                    rating: "Number, 0 by default"
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
