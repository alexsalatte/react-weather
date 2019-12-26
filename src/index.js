import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const urlBase = 'https://api.openweathermap.org/data/2.5/';
const urlImg = 'https://openweathermap.org/img/wn/';
// TODO: add appid to a key.js file
const key = require('./key.js');

function kelvinToCelcius(temp) {
  return Math.round((temp - 273.15) * 10) / 10.0;
}

function camelCase(name) {
   return name.toLowerCase().split(' ').map( word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
}

/*
View for the current weather forecast.
Currently only shows the current weather.
Hidden when page loads up.
*/
function Forecast(props) {
  return(
    <div className="card" style={{display: props.display}}>
      <h2 className="location">{props.location}</h2>
      <p className="temp">{kelvinToCelcius(props.temp)}&#8451;</p>
      <p className="humidity">Humidity: {props.humidity}%</p>
      <p className="wind">Wind: {props.wind}km/h</p>
      <img className="weather-icon" src={props.icon} alt={props.desc} />
      <p className="weather-desc">{props.desc}</p>
    </div>
  );
}

/*
Weather app parent.
Holds the form and manages the state.
Fetches weather info using openweathermap api
*/
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      city: '',
      country: '',
      location: 'N/A',
      temp: 0,
      humidity: 0,
      wind: 0,
      icon: 'logo192.png',
      desc: 'N/A',
      display: 'none',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // update state values
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    fetch(`${urlBase}weather?q=${this.state.city},${this.state.country}&appid=${key.appid}`)
      .then(
        (response) => {
          // unsuccesful request
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
              return;
          }

          // succesful request
          response.json().then((data) => {
            console.log(data);
            const weather = data.weather[0];

            // update state values
            this.setState({location: `${camelCase(this.state.city)}, ${this.state.country.toUpperCase()}`});
            this.setState({temp: data.main.temp});
            this.setState({humidity: data.main.humidity});
            this.setState({wind: Math.round(data.wind.speed * 36) / 10.0});
            this.setState({icon: `${urlImg}${weather.icon}@2x.png`});
            this.setState({desc: weather.description});
            this.setState({display: 'block'});

            // reset input values
            this.setState({ city: '' });
            this.setState({ country: '' });
          });
        }
      )
      .catch(
        (err) => {
          console.log('you suck at programming :)', err);
        }
      );
    // don't let it reload the page
    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <form id="weather-form" onSubmit={this.handleSubmit}>
          <input className="form-item" name="city" value={this.state.city} placeholder="City" onChange={this.handleChange} />
          <input className="form-item" name="country" value={this.state.country} placeholder="Country" onChange={this.handleChange} />
          <input className="button" type="submit" value="Get Weather" />
        </form>
        <Forecast
          location={this.state.location}
          temp={this.state.temp}
          humidity={this.state.humidity}
          wind={this.state.wind}
          icon={this.state.icon}
          desc={this.state.desc}
          display={this.state.display}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
