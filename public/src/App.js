import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props){
    super(props)
    
    this.state = {
      temp: 0,
      humidity: 0
    }

  }

  componentDidMount(){
    fetch("https://us-central1-gro36-weather.cloudfunctions.net/getLastMeasure")
    .then( response => {
      this.setState({
        temp: response.data[0].temp,
        humidity: response.data[0].humidity
      })
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>{this.state.temp}°C</h1>
          <h3>{this.state.humidity}% Luftfuktighet</h3>
        </header>
      </div>
    );
  }
}

export default App;
