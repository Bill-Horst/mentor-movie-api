const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topTenMovies = [
    {
        title: 'Movie 1',
        director: 'Director 1'
    },
    {
        title: 'Movie 2',
        director: 'Director 2'
    },
    {
        title: 'Movie 3',
        director: 'Director 3'
    },
    {
        title: 'Movie 4',
        director: 'Director 4'
    },
    {
        title: 'Movie 5',
        director: 'Director 5'
    },
    {
        title: 'Movie 6',
        director: 'Director 6'
    },
    {
        title: 'Movie 7',
        director: 'Director 7'
    },
    {
        title: 'Movie 8',
        director: 'Director 8'
    },
    {
        title: 'Movie 9',
        director: 'Director 9'
    },
    {
        title: 'Movie 10',
        director: 'Director 10'
    }
]

app.use(express.static('public'));

// GET requests
app.get('/', function (req, res) {
    res.send('Welcome to the Movie API!')
});
app.get('/movies', function (req, res) {
    res.json(topTenMovies)
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () =>
    console.log('Listening on 8080.')
);