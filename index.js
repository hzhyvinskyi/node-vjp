const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
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

// Add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

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
        res.send('passed');
    }
});

const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on ${port} port`);
});