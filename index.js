const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Connect to mongoose
mongoose.connect('mongodb://localhost/vjp-dev', {
    useNewUrlParser: true,
})
  .then(() => console.log('MongoDB was successfully connected!'))
  .catch(err => console.log(err));

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

// Connect flash middleware
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

app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
    console.log(`The server is running on ${port} port`);
});