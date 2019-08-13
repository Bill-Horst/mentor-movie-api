const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const auth = require('./auth')(app);
const uuid = require("uuid");
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
const cors = require('cors');
const validator = require('express-validator');
require('./passport');

const Movies = Models.Movie;
const Users = Models.User;

// local connection:
// mongoose.connect('mongodb://localhost:27017/movieApiDB', { useNewUrlParser: true });

// deployed Mongo Atlas DB:
mongoose.connect('mongodb+srv://movieApiDBAdmin:18j197ft5sf7@movieapidb-5sm08.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(validator());

app.use(cors());

app.use(express.static('public'));

// GET requests
app.get('/', function (req, res) {
    res.send('Welcome to the Movie API!');
});
app.get('/movies', passport.authenticate('jwt', { session : false }), function (req, res) {
    Movies.find(function (err, movies) {
        res.json(movies);
    });
});
app.get('/movies/:title', passport.authenticate('jwt', { session : false }), function (req, res) {
    Movies.find({ "Title": req.params.title }, function (err, movie) {
        res.json(movie);
    });
});
app.get('/genre/:genre', passport.authenticate('jwt', { session : false }), function (req, res) {
    Movies.findOne({ "Genre.Name": req.params.genre }, function (err, movie) {
        res.json(movie.Genre);
    });
});
app.get('/directors/:name', passport.authenticate('jwt', { session : false }), function (req, res) {
    Movies.findOne({ "Director.Name": req.params.name }, function (err, movie) {
        res.json(movie.Director);
    });
});
app.post('/users', function (req, res) {

    req.checkBody('Username', 'Username is required').notEmpty();
    req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
    req.checkBody('Password', 'Password is required').notEmpty();
    req.checkBody('Email', 'Email is required').notEmpty();
    req.checkBody('Email', 'Email does not appear to be valid').isEmail();
  
    var errors = req.validationErrors();
  
    if (errors) {
      return res.status(422).json({ errors: errors });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
        .then(function (user) {
            if (user) {
                return res.status(400).send(req.body.Username + " already exists");
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
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
app.put('/users/:username', passport.authenticate('jwt', { session : false }), function (req, res) {

    req.checkBody('Username', 'Username is required').notEmpty();
    req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
    req.checkBody('Password', 'Password is required').notEmpty();
    req.checkBody('Email', 'Email is required').notEmpty();
    req.checkBody('Email', 'Email does not appear to be valid').isEmail();
  
    var errors = req.validationErrors();
  
    if (errors) {
      return res.status(422).json({ errors: errors });
    }

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
app.post('/users/:username/movies/:movieId', passport.authenticate('jwt', { session : false }), function (req, res) {
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
app.delete('/users/:username/movies/:movieId', passport.authenticate('jwt', { session : false }), function (req, res) {
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
app.delete('/users/:username', passport.authenticate('jwt', { session : false }), function (req, res) {
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

// DEV ENV:
// app.listen(8080, () =>
//     console.log('Listening on 8080.')
// );

// PROD ENV:
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 3000");
});