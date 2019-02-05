const mongoose = require('mongoose');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

exports.idea_index = (req, res) => {
    Idea.find({user: req.user.id})
      .sort({date: 'desc'})
      .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
      })
}

exports.idea_create = (req, res) => {
    res.render('ideas/add');
}

exports.idea_store = (req, res) => {
    let err = [];

    if (!req.body.title) {
        err.push({text: 'Please add a title'});
    }
    if (!req.body.details) {
        err.push({text: 'Please add some details'});
    }

    if (err.length) {
        res.render('ideas/add', {
            err: err,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const idea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Idea(idea)
          .save()
          .then(idea => {
              req.flash('success_msg', 'Idea has been successfully stored');
              res.redirect('/ideas');
          });
    }
}

exports.idea_edit = (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
      .then(idea => {
          if(idea.user != req.user.id) {
              req.flash('error_msg', 'Not Authorized');
              res.redirect('/ideas');
          } else {
            res.render('ideas/edit', {
                idea: idea
            });
          }   
      });
}

exports.idea_update = (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text: 'Please add a title'});
    }
    if (!req.body.details) {
        errors.push({text: 'Please add some details'});
    }

    if (errors.length) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Idea has been successfully updated')
                    res.redirect('/ideas');
                });
        });
    }
}

exports.idea_delete = (req, res) => {
    Idea.deleteOne({_id: req.params.id})
      .then(() => {
          req.flash('success_msg', 'Idea has been deleted successfully');
          res.redirect('/ideas');
      });
}