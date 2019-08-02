const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const uuid = require("uuid");

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));

let topTenMovies = [
    {
        title: 'Movie 1',
        description: 'A great movie',
        genre: 'horror',
        director: 'Director 1',
        imageUrl: 'https://m.media-amazon.com/images/I/41sfz8dKX1L._SR500,500_.jpg',
        id: 'movie_1'
    },
    {
        title: 'Movie 2',
        director: 'Director 2',
        id: 'movie_2'
    },
    {
        title: 'Movie 3',
        director: 'Director 3',
        id: 'movie_3'
    },
    {
        title: 'Movie 4',
        director: 'Director 4',
        id: 'movie_4'
    },
    {
        title: 'Movie 5',
        director: 'Director 5',
        id: 'movie_5'
    },
    {
        title: 'Movie 6',
        director: 'Director 6',
        id: 'movie_6'
    },
    {
        title: 'Movie 7',
        director: 'Director 7',
        id: 'movie_7'
    },
    {
        title: 'Movie 8',
        director: 'Director 8',
        id: 'movie_8'
    },
    {
        title: 'Movie 9',
        director: 'Director 9',
        id: 'movie_9'
    },
    {
        title: 'Movie 10',
        director: 'Director 10',
        id: 'movie_10'
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
app.get('/movies/:title', function (req, res) {
    res.json(topTenMovies.find( (movie) => {
        return movie.title === req.params.title
    }));
});
app.get('/movies/:title/genre', function (req, res) {
    res.send(`returning genre for ${req.params.title}`)
});
app.get('/directors', function (req, res) {
    res.send('returning list of all directors');
});
app.get('/directors/:name', function (req, res) {
    res.send(`returning info about director "${req.params.name}"`);
})
app.post('/users', function (req, res) {
    let newUser = req.body;
    if (!newUser.email) {
        const message = 'user is missing email';
        res.status(400).send(message)
    } else {
        newUser.id = uuid.v4();
        res.status(201).send(newUser);
    }
});
app.put('/users/:id', function (req, res) {
    let newUser = req.body;
    res.send(`replacing user info for user number: ${req.params.id}... name: ${newUser.name}`);
});
app.post('/users/:id/favorite/:movie_id', function (req, res) {
    res.send(`adding movie with movie id '${req.params.movie_id}' to the favorite list of user number ${req.params.id}`);
});
app.delete('/users/:id/favorite/:movie_id', function (req, res) {
    res.send(`deleting movie with movie id '${req.params.movie_id}' from the favorite list of user number ${req.params.id}`);
});
app.put('/users/:id/deregister', function (req, res) {
    res.send(`deregistering user number ${req.params.id}`);
    // set user's 'active' property to false... don't delete
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () =>
    console.log('Listening on 8080.')
);