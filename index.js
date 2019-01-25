const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

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

const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on ${port} port`);
});