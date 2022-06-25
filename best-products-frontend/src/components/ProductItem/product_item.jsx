import React, { Component } from 'react';

import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
import CommentPopper from './comment_popper'
import ebayPic from './images/ebay.png'
import amazonPic from './images/amazon.png'
import {Button} from '@mui/material';

class ProductItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            star:0.0,
            comments: [],
            loadingComments : false
        }
    }
    render() {
        return(
            <div className="row p-2 mt-4 item_container item_card_border">
                <div className="col-md-3 mt-1"><img className="rounded product_img" src={this.props.product.img_url} alt="not available"></img></div>
                <div className="col-md-6 mt-1 d-flex align-items-start flex-column bd-highlight mb-3">
                    <div className="mb-auto p-2 bd-highlight">
                        <h5><a className="link-unstyled" href={this.props.product.link} target="_blank">{this.props.product.title}</a></h5>
                    </div>
                    <div className="d-flex flex-row md-2 p-2">
                        <span> {(this.props.product.stars?parseFloat(this.props.product.stars.split(" ")[0]):0.0).toFixed(1)}&nbsp;</span>
                        {this.renderStars()}
                        <span> &nbsp;{this.props.product.reviews || "no"} reviews</span>
                    </div>
                    <div className="d-flex flex-row px-2">
                         {<CommentPopper comments={this.state.comments} getComments={this.getComments} loadingComments={this.state.loadingComments}/>}
                    </div>
                </div>
                <div className="flex-col align-items-start align-content-center col-md-3 mt-1 position-relative"
                style={{"borderLeft":"1px solid rgb(200, 200, 200)"}}>
                    <div className="d-flex flex-row justify-content-between">
                        <h4>{this.renderPrice()}</h4>
                        {this.renderDiscount()}
                    </div>
                    <div className="d-flex flex-row align-items-center mt-0">
                        {this.renderPrevPrice()}
                    </div>
                    <div className="d-flex flex-column mt-auto fixed-bottom position-absolute bottom-0 px-3"
                    style={{zIndex:0}}>
                        <a href={this.props.product.link} target="_blank" className='link-unstyled'><Button variant="contained" className="" type="button" sx={{width:"100%"}}>Details</Button></a>
                        <Button variant="contained" sx={{marginTop:"3px"}} type="button">Add to wishlist</Button>

                        <div className="d-flex flex-row mb-0">
                            <p className="m-0">From:{this.renderWebsite()}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderPrice() {
        if (this.props.product.price!=null && this.props.product.price.charAt(0) !== '$') {
            return (<a href={this.props.product.link} target="_blank">See price</a>)
        }
        else {
            return this.props.product.price
        }
    }

    renderPrevPrice() {
        if (this.props.product.prev_price) {
            return (<p><s>{this.props.product.prev_price}</s></p>)
        }
    }

    renderDiscount() {
        if (this.props.product.discount) {
            return (<h5 className="text-danger">-{this.props.product.discount}</h5>)
        }
    }

    renderWebsite() {
        if (this.props.product.website==="ebay") {
            return (<img className="website_img" src={ebayPic} alt="unknown"></img>)
        }
        else if (this.props.product.website==="Amazon") {
            return (<img className="website_img" src={amazonPic} alt="unknown"></img>)
        }
        else {
            return (this.props.product.website)
        }
    }

    //render the star icons based on how many stars the product have
    renderStars() {
        var stars_icons = [];
        var star_num = this.props.product.stars?parseFloat(this.props.product.stars.split(" ")[0]):0.0
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
        if (this.state.comments.length===0 && !this.state.loadingComments) {
            this.setState({loadingComments:true})
            const url = encodeURIComponent(this.props.product.link)
            axios.get("http://localhost:8000/comment_search/"+this.props.product.website+"/"+url).then(res=>{
                const comments = res.data
                this.setState({comments, loadingComments:false})
            })
        }
    }
}

export default ProductItem