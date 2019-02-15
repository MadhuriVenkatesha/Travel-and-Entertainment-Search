import React from 'react';
import axios from "axios/index";
import Photos_Details from "./PhotoDetails"
import Reviews_Details from "./ReviewDetails"
import Mymaps from "./dir_test"
//import Mydirections from "./directions"
//Top level : TableInterface
class TableInterface extends React.Component{
    constructor(props){
        console.log("table constructor")
        super(props);
        this.state={
            isClicked:false,
            reviewData:"",
            photo_key:1
        }
    }
    setIsClicked(id){
        var APIkey=this.props.APIkey;
        axios.get('http://localhost:8081/fetchReviews',{
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            },
            params:{
                id:id,
                key:APIkey
            },
        })
            .then((response)=>{ {
                this.setState({
                    isClicked:true,
                    reviewData:response,
                    photo_key:this.state.photo_key+1
                })
            }})
            .catch(function (error) {
                console.log(error);
            });
    }
    render(){
        if(this.state.isClicked){
            return(
                <Details reviewData={this.state.reviewData} APIkey={this.props.APIkey} photo_key={this.state.photo_key}/>
            )
        }
        else if(this.props.tableData){
            const props={
                Tabledata:this.props.tableData,
                onclick:(id)=>{this.setIsClicked(id)
                }
            };
            return(
                <DisplayTable {...props}/>
            )
        }
        else{
            return (<h1></h1>)
        }
    }
}

//Level 1: Details, DisplayTable
class Details extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            photos_check: false,
            reviews_check: false
        }
    }

    render(){
        var ReviewPhotoData=this.props.reviewData;
        var name=ReviewPhotoData.data.result.name;
        var photo_array=ReviewPhotoData.data.result.photos;
        var review_array=ReviewPhotoData.data.result.reviews;
        var counter=1;
        photo_array.slice(0,5).map((photo)=> {
            axios.get('http://localhost:8081/savePhotos',{
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                },
                params:{
                    counter:counter,
                    key:this.props.APIkey,
                    height:photo.height,
                    width:photo.width,
                    reference:photo.photo_reference,
                },
            })
                .then((response)=>{ {
                    console.log('photo saved')
                }})
                .catch(function (error) {
                    console.log(error);
                });
            counter=counter+1;
        })
        return(
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3" style={{textAlign:"center"}}>
                        <label>{name}</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3">
                        <Reviews_Details reviews={review_array}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 col-sm-offset-3" style={{textAlign:"center"}}>
                        <Photos_Details key={this.props.photo_key} photos={photo_array} APIkey={this.props.APIkey}/>
                    </div>
                </div>
            </div>
        )
    }
}
class DisplayTable extends React.Component{
    render(){
        var data = this.props.Tabledata;
        console.log(data)
        if(data) {
            var items=data.results;
            console.log(data);
            return (
                <div className="container">
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Category</th>
                            <th>Name</th>
                            <th>Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item,index)=>{
                            return(<tr key={item.id}>
                                <td><img src={item.icon} className="img-rounded"/></td>
                                <td onClick={()=>{this.props.onclick(item.place_id,item.name)}}>{item.name}</td>
                                <td>
                                    <Mymaps name={item.vicinity} lat={item.geometry.location.lat} lon={item.geometry.location.lng} data={this.props.Tabledata} index={index}/>
                                </td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            );
        }
        else{
            return(<div></div>)
        }
    }
}

//Level 2 under Details: Photo_Details, Review_Details


export default TableInterface;