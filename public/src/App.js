import React, { Component } from 'react';
import './App.css';
import moment from 'moment'

class App extends Component {

  constructor(props){
    super(props)
    
    this.state = {
      temp: 0,
      humidity: 0,
      timestamp: null
    }

  }

  componentDidMount(){
    fetch("https://us-central1-gro36-weather.cloudfunctions.net/weather_api/getLastMeasure")
      .then((response)=>{
        return response.json();
      })
      .then((myJson)=>{
        const date = moment.unix(myJson.data[0].timestamp._seconds)
        this.setState({
          temp: myJson.data[0].temp,
          humidity: myJson.data[0].humidity,
          timestamp: date.toString()
        })
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>{this.state.temp}°C</h1>
          <h3>{this.state.humidity}% Luftfuktighet</h3>
          <p>Mätning gjord: {this.state.timestamp}</p>
        </header>
      </div>
    );
  }
}

export default App;
