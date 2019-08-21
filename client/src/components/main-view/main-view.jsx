import React from 'react';
import axios from 'axios';
import './main-view.scss';
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { RegistrationView } from '../registration-view/registration-view';

export class MainView extends React.Component {

    constructor() {
        super();
        this.state = {
            movies: null,
            selectedMovie: null,
            registered: null,
            user: null
        };
    }

    componentDidMount() {
        axios.get('https://mentor-movie-api.herokuapp.com/movies')
            .then(response => {
                this.setState({
                    movies: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onMovieClick(movie) {
        this.setState({
            selectedMovie: movie
        });
    }

    onLoggedIn(user) {
        this.setState({
            user
        });
    }

    onRegistered(registered) {
        this.setState({
            registered
        })
    }

    returnToMainView() {
        this.setState({
            selectedMovie: null
        });
    }

    render() {
        const { movies, selectedMovie, user, registered } = this.state;

        if (!user && !registered) return <RegistrationView onRegistered={registered => this.onRegistered(registered)} />;

        if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

        if (!movies) return <div className="main-view" />;

        return (
            <div className="main-view">
                <Container>
                    <Row>
                        {selectedMovie
                            ? <MovieView movie={selectedMovie} returnToMain={button => this.returnToMainView()} />
                            : movies.map(movie => (
                                <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
                            ))
                        }
                    </Row>
                </Container>

            </div>
        );
    }
}