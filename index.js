const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/vjp-dev', {
    useNewUrlParser: true,
})
  .then(() => console.log('MongoDB was successfully connected!'))
  .catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Define global variables for messages
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Index route
app.get('/', (req, res) => {
    const title = 'WELCOME!';
    res.render('index', {
        title: title
    });
});

// About route
app.get('/about', (req, res) => {
    res.render('about');
});

// Add Idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea form
app.get('/ideas/edit/:id', (req, res) => {
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
app.put('/ideas/:id', (req, res) => {
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
app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({_id: req.params.id})
      .then(() => {
          req.flash('success_msg', 'Idea has been deleted successfully');
          res.redirect('/ideas');
      });
});

// Display Ideas listing
app.get('/ideas', (req, res) => {
    Idea.find({})
      .sort({date: 'desc'})
      .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
      })
});

// Store Idea
app.post('/ideas', (req, res) => {
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

const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on ${port} port`);
});