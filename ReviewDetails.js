//Level 2 under Details: Review_Details
import React from 'react';

class Reviews_Details extends React.Component{
    constructor(props) {
        console.log("reviews constructor")
        super(props);
        this.state = {
            reviews_check: false,
        }

    }
    Arrow_Clicked(){
        this.setState({
            reviews_check: !this.state.reviews_check
        });
    }

    render()
    {
        console.log(this.state.reviews_check);
        if (!this.state.reviews_check) {
            return (
                <div className="row" onClick={()=>{this.Arrow_Clicked()}}>
                    <p style={{textAlign:"center"}}>Click here for Reviews</p>
                    <p style={{textAlign:"center"}}><span className="glyphicon glyphicon-chevron-down"></span></p>
                </div>
            )
        }
        else{
            var reviews=this.props.reviews;
            return(
                <div className="row" onClick={()=>{this.Arrow_Clicked()}}>
                    <p style={{textAlign:"center"}}>Click here to hide Reviews</p>
                    <p style={{textAlign:"center"}}><span className="glyphicon glyphicon-chevron-up"></span></p>
                    <div className="container-fluid col-sm-12 quarter_box">
                        {reviews.slice(0,5).map((review)=> {
                            return(
                                <React.Fragment key={review.profile_photo_url}>
                                    <div className="row bottom_border">
                                        <div style={{display:"table",width:"100%"}}>
                                            <div className="col-sm-1 col-sm-offset-5" style={{display:"table-cell"}}>
                                                <img src={review.profile_photo_url} className="img-circle" height={30} width={30}/>
                                            </div>
                                            <div className="col-sm-3" style={{display:"table-cell"}}>
                                                <b>{review.author_name}</b>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row bottom_border">
                                        {review.text}
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
            )
        }
    }
}
export default Reviews_Details;