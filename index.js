const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

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

// Aboute route
app.get('/about', (req, res) => {
    res.render('about');
});

const port = 3000;

app.listen(port, () => {
    console.log(`The server is running on ${port} port`);
});