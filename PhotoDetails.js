//Level 2 under Details: Photo_Details
import React from 'react';
import axios from "axios/index";

class Photos_Details extends React.Component{
constructor(props) {
    super(props);
    console.log("photo_Details Constructor")
    this.state = {
        photos_check: false,
        res:false,
        URL_array:[],
        key_id:1
    }
}
    Down_Arrow_Clicked(){
        var i=1;
        console.log(this.state.URL_array);
        if(this.state.URL_array.length==0) {
            while (i < 6) {
                axios.get('http://localhost:8081/images', {
                    params: {
                        i: i
                    }
                })
                    .then((response) => {
                        console.log(response)
                        var temp = this.state.URL_array.slice()
                        temp.push(response.data);
                        console.log(temp)
                        this.setState({
                            URL_array: temp,
                            photos_check: true
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                i = i + 1
            }
        }
        else{
            this.setState({
                photos_check: true
                }
            )
        }
    }
    Arrow_Clicked(){
        this.setState({
            photos_check: !this.state.photos_check
        });
    }

    render()
    {
        if (!this.state.photos_check) {
            return (
                <div className="row">
                    <p>Click here for Photos</p>
                    <span className="glyphicon glyphicon-chevron-down" onClick={()=>{this.Down_Arrow_Clicked()}}></span>
                </div>
            )
        }
        else{
                return(
                    <div className="container-fluid">
                        <p>Click here to hide Photos</p>
                        <span className="glyphicon glyphicon-chevron-up" onClick={()=>{this.Arrow_Clicked()}}></span>
                        <DisplayPhotos my_photos={this.state.URL_array}/>
                    </div>
                )
        }
    }
}

class DisplayPhotos extends React.Component{
    render(){
        var dummy=Math.random();
        var my_potos=this.props.my_photos
        console.log(my_potos)
        var cou=0;
        if(my_potos){
            return(
             <div className="row">
                 <div className="col-md-9 col-md-offset-1">
                 <table>
                     <tbody>
                        {my_potos.map((item,index)=> {
                            dummy=dummy+1000;
                            cou=cou+1
                            return(
                            <tr key={index}>
                                <td className="table_style" style={{ padding: 10}}><a href={'http://localhost:8081/serverPhotos?i='+(index+1).toString()} target="_blank"><img src={item+'?dummy='+dummy.toString()} alt="Sorry no picture" width={600} height={600}/></a></td>
                            </tr>
                        )
                    }
                )}
                     </tbody>
                 </table>
                 </div>
             </div>
                )
        }
        else{
            return(
            <h1>Error</h1>)
        }
    }
}
export default Photos_Details;