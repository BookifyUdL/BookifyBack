const mongoose = require('mongoose');
const Shop = require('../models/shop.js');

exports.create_shop = (req, res, next) => {
    console.log(req.file);
    const shop = new Shop({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        url: req.body.url,
    });
    shop.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created shop successfully",
            createdShop: {
                _id: result._id,
                name: result.name,
                url: result.url,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/shops/' + result._id
                }

            }
        });
    })
    .catch(err => console.log(err));
}
exports.get_all_shop = (req, res, next) => {
    Shop
    .find()//Without parameters it will get all the options.
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                shops: results.map( result => {
                    return {
                        _id: result._id,
                        name: result.name,
                        url: result.url,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/shops/' + result._id
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
exports.get_shop = (req, res, next) => {
    const shopId = req.params.shopId;//params--> object with all the params we have.
    Shop.findById(shopId)
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                shop: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_SHOPS",
                    url: 'http://localhost:3000/shops/'
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

exports.update_shop_mobile = (req, res, next) => {
    const id = req.params.shopId;
    Shop.findByIdAndUpdate(id, 
        {
            name: req.body.name,
            url: req.body.url
        }, {new: true}) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Shop information updated",
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

exports.update_shop = (req, res, next) => {
    const id = req.params.shopId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; //This will give us an updated object.
    }
    Shop.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Shop information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/shops/" + id
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_shop = (req, res, next) => {
    const id = req.params.shopId;
    Shop.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Shop deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/shops/",
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
