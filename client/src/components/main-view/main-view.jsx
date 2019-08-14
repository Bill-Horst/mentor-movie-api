import React from 'react';
import axios from 'axios';

export class MainView extends React.Component {

    constructor() {
        super();
        this.state = {};
      }

    componentDidMount() {
      axios.get('https://mentor-movie-api.herokuapp.com/movies')
        .then(response => {
            console.log(response.data)
          this.setState({
            movies: response.data
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  
  
    render() {
      // If the state isn't initialized, this will throw on runtime
      // before the data is initially loaded
      const { movies } = this.state;
  
      // Before the movies have been loaded
      if (!movies) return <div className="main-view"/>;
  
      return (
       <div className="main-view">
       { movies.map(movie => (
         <div className="movie-card" key={movie._id}>{movie.Title}</div>
       ))}
       </div>
      );
    }
  }