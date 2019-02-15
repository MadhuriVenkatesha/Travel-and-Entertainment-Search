import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import formData from './inputData.js';
import axios from 'axios';
import TableInterface from './table'
class TravelForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            keyword:"",
            category:"default",
            distance:10,
            location:"",
            chk1:true,
            chk2:false,
            chk2_val:'',
        }
    }
    setScope(my_func){
        my_func=my_func.bind(this);
        return my_func
    }
    setKey(key,event){
        this.setState({
            [key]:event.target.value
        })
    }
    fetchPlaces(lat,lon){
        axios.get('http://localhost:8081/fetch',{
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            },
            params:{location:lat.toString()+','+lon.toString(),
                key:this.props.APIkey,
                radius:parseInt(this.state.distance*1609.34),
                type:this.state.category,
                keyword:this.state.keyword,
            },
        })
            .then((response)=>{ {
                response.data['lat']=lat;
                response.data['lon']=lon;
                console.log(response)
                this.props.setPlaceData(response)
            }})
            .catch(function (error) {
                console.log(error);
            });
    }
    GetCoordinates(){ //Get the coordinates of current location
        var lat=undefined;
        var long=undefined;
        if(this.state.chk1){
            axios.get('http://ip-api.com/json')
                .then((response)=> {
                    lat=response.data.lat;
                    long=response.data.lon;
                    this.fetchPlaces(lat,long);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else{
            axios.get('https://maps.googleapis.com/maps/api/geocode/json',{params:{address:this.state.chk2_val,key:this.props.APIkey}})
                .then((response) =>{
                    var Coord_API_Result=response.data.results[0].geometry.location;
                    lat= Coord_API_Result.lat;
                    long= Coord_API_Result.lng;
                    console.log(lat,long)
                    this.fetchPlaces(lat,long);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    render() {
        var categories=formData.spinnerData;
        var chk= function(evt) {
            this.setState({
                chk1:true,
                chk2:false
            })
        }
        var chk_loc = function(evt) {
            this.setState({
                chk2:true,
                chk1:false
            })
        }
        chk=chk.bind(this);
        chk_loc=this.setScope(chk_loc);
        return (
            <div className="container-fluid" style={{ height: '33%' }}>
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3 grey_border">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12 text-center">
                                    <h2>Travel and Entertainment Search</h2>
                                </div>
                                <form>
                                <div className="form-group">
                                    <label htmlFor="kwd">Keyword:</label>
                                    <input type="text" className="form-control" id="kwd" onChange={(evt)=>{this.setKey("keyword",evt)}} value={this.state.keyword}/>
                                </div>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div>
                                            Category:
                                        </div>
                                        <select className="bootstrap-select" onChange={(evt)=>{this.setKey("category",evt)}} value={this.state.category}>
                                            <option value="" defaultValue={"default"}>Default</option>
                                            {categories.map(function (category) {
                                                return (<option value={category} key={category}>{category}</option>);
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <br/>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="dist">Distance:</label><input value={this.state.distance} type="number" className="form-control" id="dist" onChange={(evt)=>{this.setKey("distance",evt)}}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-1"></div>
                                    <div className="col-sm-5">
                                        <div className="radio">
                                            <label><input type="radio" name="optradio" defaultChecked onClick={chk}/>Current Location</label>
                                        </div>
                                        <div className="radio">
                                            <label><input type="radio" name="optradio" onClick={chk_loc}/>
                                                <input type="text" id="user_loc" onChange={(evt)=>{this.setKey("chk2_val",evt)}}/>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="form-group">
                                            <button type="button" className="btn btn-default" onClick={()=>{this.GetCoordinates()}}>Submit</button>
                                            <button type="button" className="btn btn-default">Clear</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

class TravelSearchEnt extends React.Component{
    constructor(props){
        super(props);
        this.state={
            placesData:undefined,
            key_id:1,
            key:"AIzaSyA43HNfa0YhCHKMUGFLnjcXFugKM8A9OFw",
            map_loaded:false
        }
    }
    getGoogleMaps() {
        // If we haven't already defined the promise, define it
                // Add a global handler for when the API finishes loading

                window.resolveGoogleMapsPromise = () => {
                    // Resolve the promise
                    this.setState({
                        map_loaded:true
                    })

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
    }
    componentDidMount() {
    // Start Google Maps API loading since we know we'll soon need it
        this.getGoogleMaps();
    }


    setPlaceData(response){
        this.setState({
            placesData:Object.assign({},response.data),
            key_id:this.state.key_id+1
        })
    }
    render(){
        //console.log(this.state.placesData);
        const props={
            APIkey:this.state.key,
            setPlaceData:(response)=>{this.setPlaceData(response)}
        }
        return(
            <React.Fragment>
                <TravelForm {...props}/>
                <TableInterface key={this.state.key_id} tableData={this.state.placesData} APIkey={this.state.key}/>
            </React.Fragment>
        );

    }

}


ReactDOM.render(
    <TravelSearchEnt />,
    document.getElementById('root')
);