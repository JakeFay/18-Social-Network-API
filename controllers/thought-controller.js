const { Thought, User } = require('../models');
const { db } = require('../models/User');

const thoughtController = {

    // get all Thoughts
    getAllThoughts(req, res) {
        Thought.find({})
         
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // get one Thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
           
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });

    },

    // create Thought
    createThought({ body }, res) {  
        Thought.create(body)
            .then(dbThoughtData => {
                User.findByIdAndUpdate(body.userId, {
                    $addToSet: {thoughts: dbThoughtData._id}
                }, {new: true})
                res.json(dbThoughtData)})
            .catch(err => res.json(err));
    },

    // update Thought by id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No Thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // delete Thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    },

    createReaction({ params , body}, res) {
        Thought.findByIdAndUpdate(
            {_id: params.thoughtId},
            {
            $addToSet:{reactions: body}
        }, 
        {new: true})
       .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    deleteReaction({ params }, res) {
        console.log(params)
        Thought.findOneAndUpdate(
            
            {_id: params.thoughtId},
            {$pull:{ reactions:{ reactionId: params.reactionId}}},
            {new: true}
            )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },
};

module.exports = thoughtController;