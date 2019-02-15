/*global google*/
import React, { Component } from 'react';
class ContactBody extends React.Component {
    constructor(props){
        super(props)
        this.state={
            mode:false
        }
    }
    getGoogleMaps() {
        // If we haven't already defined the promise, define it
        if (!this.googleMapsPromise) {
            this.googleMapsPromise = new Promise((resolve) => {
                // Add a global handler for when the API finishes loading

                window.resolveGoogleMapsPromise = () => {
                    // Resolve the promise
                    resolve(google);

                    // Tidy up
                    delete window.resolveGoogleMapsPromise;
                };

                // Load the Google Maps API
                const script = document.createElement("script");
                const API = 'AIzaSyA43HNfa0YhCHKMUGFLnjcXFugKM8A9OFw';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
            });
        }

        // Return a promise for the Google Maps API
        return this.googleMapsPromise;
    }

    //componentWillMount() {
        // Start Google Maps API loading since we know we'll soon need it
    //    this.getGoogleMaps();
    //}

    componentDidMount() {
        // Once the Google Maps API has finished loading, initialize the map
            if(google) {
                var divid='map'+(this.props.index).toString();
                var uluru={lat: this.props.lat, lng: this.props.lon};
                //console.log(document.getElementById(divid));
               // var contentString="<ul><li>first</li><li>second</li><li>third</li></ul>"
                /*var infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    pixelOffset: new google.maps.Size(-50,-50)
                });*/
                var map = new google.maps.Map(document.getElementById(divid), {
                    zoom: 14,
                    center: uluru
                });
               // console.log(map)
                var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
             //   infowindow.open(map, marker);
            }
    }
    travel_Mode(evt){
        var mode=evt;
        var divid='map'+(this.props.index).toString();
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var dest = {lat: this.props.lat, lng: this.props.lon};
        var source = {lat:this.props.data.lat,lng:this.props.data.lon}
        var mapOptions = {
            zoom:15,
            center: source
        }
        var request = {
            origin: source,
            destination: dest,
            travelMode: mode
        };
        var map = new google.maps.Map(document.getElementById(divid), mapOptions);
        directionsDisplay.setMap(map);
        directionsService.route(request, function(result, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(result);
            }
        });
    }

    render() {
        if (google) {
            console.log(this.props.data);
            var divid='map'+(this.props.index).toString();
            return (

                <div className="dropdown">
                    <p className="dropdown-toggle" data-toggle="dropdown"><b>{this.props.name}</b></p>
                    <div className="row" data-toggle="dropdown" style={{width:'50%'}}>
                        <div className="col-md-4" onClick={()=>{this.travel_Mode('WALKING')}}>Walking</div>
                        <div className="col-md-4" onClick={()=>{this.travel_Mode('BICYCLING')}}>Biking</div>
                        <div className="col-md-4" onClick={()=>{this.travel_Mode('DRIVING')}}>Driving</div>
                    </div>
                    <div className="dropdown-menu">
                        <div id={divid} style={{height:400, width:400}}></div>
                    </div>
                </div>

            )
        }
        else{
            return(
                    <div>sorry no maps yet</div>
            )
        }
    }
}

export default ContactBody;
