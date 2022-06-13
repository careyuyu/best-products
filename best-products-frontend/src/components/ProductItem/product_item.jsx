import React, { Component } from 'react';

import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import CommentPopper from './comment_popper'

class ProductItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            star:0.0,
            comments: [],
            loadingComments : false
        }
        this.state.star = this.props.product.stars?parseFloat(this.props.product.stars.split(" ")[0]):0.0
    }
    render() {
        return(
            <div className="row p-2 bg-white border rounded mt-2 item_container shadow-sm">
                <div className="col-md-3 mt-1"><img className="rounded product_img" src={this.props.product.img_url}></img></div>
                <div className="col-md-6 mt-1 d-flex align-items-start flex-column bd-highlight mb-3">
                    <div className="mb-auto p-2 bd-highlight">
                        <h5><a className="link-unstyled" href={this.props.product.link} target="_blank">{this.props.product.title}</a></h5>
                    </div>
                    <div className="d-flex flex-row md-2 p-2">
                        <span> {this.state.star}&nbsp;</span>
                        {this.renderStars()}
                        <span> &nbsp;{this.props.product.reviews || "no"} reviews</span>
                    </div>
                    <div className="d-flex flex-row px-2">
                         {<CommentPopper comments={this.state.comments} getComments={this.getComments}/>}
                    </div>
                </div>
                <div className="align-items-center align-content-center col-md-3 border-left mt-1">
                    <div className="d-flex flex-row align-items-center">
                        <h4 className="mr-1">{this.props.product.price}</h4>
                        {//<span className="strike-text">$20.99</span>
                        }
                    </div>
                    <h6 className="text-success">Free shipping</h6>
                    <div className="d-flex flex-column mt-4">
                        <button className="btn btn-primary btn-sm" type="button">Details</button>
                        <button className="btn btn-outline-primary btn-sm mt-2" type="button">Add to wishlist</button>

                        <div className="mt-auto d-flex flex-row">
                            <p>From:</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    //render the star icons based on how many stars the product have
    renderStars() {
        var stars_icons = [];
        var star_num = this.state.star
        for (var i = 0; i < 5; i++) {
            if(star_num>=1) {
                stars_icons.push(<i className="bi bi-star-fill yellow" key={i}></i>)
            }
            else if (star_num>=0.5) {
                stars_icons.push(<i className="bi bi-star-half yellow" key={i}></i>)
            }
            else {
                stars_icons.push(<i className="bi bi-star yellow" key={i}></i>)
            }
            star_num--
        }

        return (
            <div className="ratings mr-2">
                {stars_icons}
            </div>
        )
    }

    //get the comment info of a product
    getComments =()=> {
        if (!this.state.loadingComments) {
            this.setState({loadingComments:true})
            const url = encodeURIComponent(this.props.product.link)
            axios.get("http://localhost:8000/comment_search/"+this.props.product.website+"/"+url).then(res=>{
                const comments = res.data
                this.setState({comments})
                console.log("finish loading comments")
            })
        }
        else {
            console.log(this.state.comments)
        }
    }
}

export default ProductItem