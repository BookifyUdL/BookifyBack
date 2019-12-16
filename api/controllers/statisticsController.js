const mongoose = require('mongoose');
const Statistics = require('../models/statistics.js');

exports.create_statistics = (req, res, next) => {
    console.log(req.file);
    const statistics = new Statistics({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        type: req.body.type,
        time: req.body.time
    });
    statistics.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created shop successfully",
            createdShop: {
                _id: result._id,
                type: result.type,
                quantity: result.quantity,
                time: result.time,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/shops/' + result._id
                }

            }
        });
    })
    .catch(err => console.log(err));
}

exports.get_all_statistics = (req, res, next) => {
    Statistics
    .find()//Without parameters it will get all the options.
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                statistics: results.map( result => {
                    return {
                        _id: result._id,
                        type: result.type,
                        quantity: result.quantity,
                        time: result.time,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/statistics/' + result._id
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

exports.get_statistics_by_id = (req, res, next) => {
    const statisticsId = req.params.statisticsId;//params--> object with all the params we have.
    Statistics.findById(statisticsId)
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                statistics: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_STATISTICS",
                    url: 'http://localhost:3000/statistics/'
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

exports.update_statistics_increment = (req, res, next) => {
    const id = req.params.statisticsId;//params--> object with all the params we have.
    Statistics.findByIdAndUpdate(id,
        {
            $inc: {quantity: 1},
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
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_statistics = (req, res, next) => {
    const id = req.params.statisticsId;
    Statistics.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Statistics deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/statistics/"
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

exports.init_statistics = (req, res, next) => {

    Statistics.remove({});
    var statistics = new Statistics({
        _id: mongoose.Types.ObjectId(),
        quantity: 10,
        type: 1,
        time: new Date(2019, 10, 3)
    });

    statistics.save();

    statistics = new Statistics({
        _id: mongoose.Types.ObjectId(),
        quantity: 40,
        type: 1,
        time: new Date(2019, 10, 4)
    });
    statistics.save();

    statistics = new Statistics({
        _id: mongoose.Types.ObjectId(),
        quantity: 100,
        type: 1,
        time: new Date(2019, 10, 5)
    });
    statistics.save();

    statistics = new Statistics({
        _id: mongoose.Types.ObjectId(),
        quantity: 10,
        type: 2,
        time: new Date(2019, 10, 3)
    });

    statistics.save();

    statistics = new Statistics({
        _id: mongoose.Types.ObjectId(),
        quantity: 40,
        type: 2,
        time: new Date(2019, 10, 4)
    });
    statistics.save();

    statistics = new Statistics({
        _id: mongoose.Types.ObjectId(),
        quantity: 100,
        type: 2,
        time: new Date(2019, 10, 5)
    });
    statistics.save();
    res.send();
};

exports.get_statistics_by_type = (req, res, next) => {
    const paramType = req.params.type;

    Statistics.find({type: paramType}).sort({time: 1})
        .exec()
        .then(doc => {
            console.log("From Database: " + doc);
            if(doc){
                res.status(200).json({
                    statistics: doc,
                    request: {
                        type: 'GET',
                        description: "GET_ALL_STATISTICS",
                        url: 'http://localhost:3000/statistics/'
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
