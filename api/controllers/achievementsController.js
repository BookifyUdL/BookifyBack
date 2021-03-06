const mongoose = require('mongoose');
const Achievement = require('../models/achievement.js');

exports.create_achievement = (req, res, next) => {
    console.log(req.file);
    const achievement = new Achievement({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        rank: req.body.rank,
        points: req.body.points
    });
    achievement.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Achievement created successfully",
            createdAchievement: {
                _id: result._id,
                name: result.name,
                points: result.points,
                rank: result.rank,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/achievements/' + result._id
                }

            }
        });

    })
    .catch(err => console.log(err));
}
exports.get_all_achievement = (req, res, next) => {
    Achievement
    .find()//Without parameters it will get all the options.
    .exec()
    .then(results => {
        if(results.length >= 0){
            const response = {
                count: results.length,
                achievements: results.map( result => {
                    return {
                        _id: result._id,
                        name: result.name,
                        points: result.points,
                        rank: result.rank,
                        //extra information, about how to do a get.
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/achievements/' + result._id
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

exports.get_achievement = (req, res, next) => {
    const achievementId = req.params.achievementId;//params--> object with all the params we have.
    Achievement.findById(achievementId)
    .exec()
    .then(doc => {
        console.log("From Database: " + doc);
        if(doc){
            res.status(200).json({
                achievement: doc,
                request: {
                    type: 'GET',
                    description: "GET_ALL_ACHIEVEMENTS",
                    url: 'http://localhost:3000/achievements/'
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

exports.update_achievement_mobile = (req, res, next) => {
    const id = req.params.achievementId;
    Achievement.findByIdAndUpdate(id, 
        {
            name: req.body.name,
            points: req.body.points,
            rank: req.body.rank
        }, {new: true}) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Achievement information updated",
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

exports.update_achievement = (req, res, next) => {
    const id = req.params.achievementId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value; //This will give us an updated object.
    }
    Achievement.update({ _id: id }, {$set: updateOps }) //2nd argument, how we want to update this.
        .exec()
        .then( result => {
            res.status(200).json({
                message: "Achievement information updated",
                request:{
                    type: "GET",
                    url: "http://localhost:3000/achievements/" + id
                }
            });
        })
        .catch( err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_achievement = (req, res, next) => {
    const id = req.params.achievementId;
    Achievement.remove({_id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Achievement deleted",
            request:{
                type: "POST",
                url: "http://localhost:3000/achievements/",
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
