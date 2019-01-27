const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Display Idea listing
router.get('/', (req, res) => {
    Idea.find({})
      .sort({date: 'desc'})
      .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
      })
});

// Add Idea form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

// Store Idea
router.post('/', (req, res) => {
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
            details: req.body.details
        };
        new Idea(idea)
          .save()
          .then(idea => {
              req.flash('success_msg', 'Idea has been successfully stored');
              res.redirect('/ideas');
          });
    }
});

// Edit Idea form
router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
      .then(idea => {
          res.render('ideas/edit', {
              idea: idea
          });
      });
});

// Edit form process
router.put('/:id', (req, res) => {
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
});

// Delete Idea
router.delete('/:id', (req, res) => {
    Idea.deleteOne({_id: req.params.id})
      .then(() => {
          req.flash('success_msg', 'Idea has been deleted successfully');
          res.redirect('/ideas');
      });
});

module.exports = router;