const mongoose = require('mongoose');
const Item = require('../models/item.js');

exports.create_item = (req, res, next) => {
    console.log(req.file);
    const item = new Item({
        _id: mongoose.Types.ObjectId(),
        shop_id: req.body.shop_id,
        book_id: req.body.book_id,
        price: req.body.price,
        result: req.body.result
    });
    item.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created item successfully",
            createdItem: {
                _id: result._id,
                shop_id: result.shop_id,
                book_id: result.book_id,
                price: result.price,
                url: result.url,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/items/' + result._id
                }

            }
        });
    })
    .catch(err => console.log(err));
}
exports.get_all_item = (req, res, next) => {
    Item
    .find()//Without parameters it will get all the options.
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                items: results.map( result => {
                    return {
                        _id: result._id,
                        shop_id: result.shop_id,
                        book_id: result.book_id,
                        price: result.price,
                        url: result.url,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/items/' + result._id
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
exports.get_item = (req, res, next) => {
    const itemId = req.params.itemId;//params--> object with all the params we have.
    Item.findById(itemId)
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                item: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_ITEMS",
                    url: 'http://localhost:3000/items/'
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
exports.update_item = (req, res, next) => {
    const id = req.params.itemId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; //This will give us an updated object.
    }
    Item.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Item information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/items/" + id
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_item = (req, res, next) => {
    const id = req.params.itemId;
    Item.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Item deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/items/",
                body: {shop_id: "Shop",
                       book_id: "Book",
                       price: "String",
                       url: "String"}
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
