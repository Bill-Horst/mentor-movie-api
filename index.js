const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movieApiDB', { useNewUrlParser: true });

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));

app.use(express.static('public'));

// GET requests
app.get('/', function (req, res) {
    res.send('Welcome to the Movie API!')
    // Movies.find({"Genre.Name" : "Comedy"}, function(err, movies) {
    //     res.send(movies)
    // })
});
app.get('/movies', function (req, res) {
    Movies.find(function (err, movies) {
        res.json(movies);
    });
});
app.get('/movies/:title', function (req, res) {
    Movies.find({ "Title": req.params.title }, function (err, movie) {
        res.json(movie);
    });
});
app.get('/genre/:genre', function (req, res) {
    Movies.findOne({ "Genre.Name": req.params.genre }, function (err, movie) {
        res.json(movie.Genre);
    });
});
app.get('/directors/:name', function (req, res) {
    Movies.findOne({ "Director.Name": req.params.name }, function (err, movie) {
        res.json(movie.Director);
    });
});
app.post('/users', function (req, res) {
    Users.findOne({ Username: req.body.Username })
        .then(function (user) {
            if (user) {
                return res.status(400).send(req.body.Username + " already exists");
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then(function (user) { res.status(201).json(user) })
                    .catch(function (error) {
                        console.error(error);
                        res.status(500).send("Error: " + error);
                    })
            }
        }).catch(function (error) {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
});
app.put('/users/:username', function (req, res) {
    Users.findOneAndUpdate({ Username: req.params.username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }, // This line makes sure that the updated document is returned
        function (err, updatedUser) {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser)
            }
        })
});
app.post('/users/:username/movies/:movieId', function (req, res) {
    Users.findOneAndUpdate({ Username: req.params.username }, {
        $push: { FavoriteMovies: req.params.movieId }
    },
        { new: true },
        function (err, updatedUser) {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser)
            }
        })
});
app.delete('/users/:username/movies/:movieId', function (req, res) {
    Users.findOneAndUpdate({ Username: req.params.username }, {
        $pull: { FavoriteMovies: req.params.movieId }
    },
        { new: true },
        function (err, updatedUser) {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser)
            }
        })
});
app.delete('/users/:username', function (req, res) {
    Users.findOneAndRemove({ Username: req.params.username })
        .then(function (user) {
            if (!user) {
                res.status(400).send(req.params.username + " was not found");
            } else {
                res.status(200).send(req.params.username + " was deleted.");
            }
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () =>
    console.log('Listening on 8080.')
);