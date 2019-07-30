import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

class App extends Component {

  state = {
    venues: []
  }

  componentDidMount(){
    this.fetchVenues()
  }
loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?AIzaSyCQuQD-gp8vy07mtcRpjAEdBCQwbnl-1Kk&callback=initMap")
    window.initMap = this.initMap
  }

  fetchVenues = () => {
    //API request URL
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "USOWUM0VD5VWO0SNDZW410JWYYGSHQRTSQK0SPN5JXSZRQDE",
      client_secret: "OU3YQ4VTIWNKG5DRTACUDUFCNSXVWHB5YEBDPXE0BVSOYG1C",
      query: "museum",
      near: "Copenhagen",
      v: "20192007"
    }
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({
        venues: response.data.response.groups[0].items
      }, this.loadMap()) 
    })
    .catch(error => {
      console.log('ERROR' + error)
    })
  }

  initMap = () => {

    // Create A Map
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 55.6761, lng: 12.5683},
      zoom: 12
    })

    //create info window
    var infowindow = new window.google.maps.InfoWindow()

    //Display dynamic markers
    this.state.venues.map(myVenue => {
      
      var contentStr = `${myVenue.venue.name}` +'<br><br>' +
      `${myVenue.venue.location.address}`

      //create marker
      const marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name
        
      });
      
      //create costum icons
      var iconBase =
            'https://img.icons8.com/color/48/000000/museum.png';

      var icons = {
        museum: {
          icon: iconBase
        }
      };
      //create hidden places as an array 
      const locationData = [
    {
      position: new window.google.maps.LatLng(55.6722, 12.5898),
      type: 'museum'
    }, 
    {
      position: new window.google.maps.LatLng(55.6788, 12.5843),
      type: 'museum'
    }, 
    {
      position: new window.google.maps.LatLng(55.6744, 12.5768),
      type: 'museum'
    }
];
    //loop through hidden places
    for (var i = 0; i < locationData.length; i++) {
      var hiddenPlaces = new window.google.maps.Marker({
        position: locationData[i].position,
        icon: icons[locationData[i].type].icon,
        map: map
      });
    };

    //add info window to marker
    hiddenPlaces.addListener('click', function() {
    })

      //add info window to marker
      marker.addListener('click', function() {
        //append content to info window
      infowindow.setContent(contentStr)
        //open infowindow
        infowindow.open(map, marker)
      })
    })
    
  }

  render() {
    return (
      <main>
        <div id="info-box">
          <h3>Welcome to HiddenMuseum!</h3>
          <p>The icons with the style of a temple is where a hidden museum lies.
          There is no description. It is up to you to go out there and explore them on your own and find out what lies hidden! </p>
        </div>
        <div id="map">
        </div>
      </main>
    )
  }
}

function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
