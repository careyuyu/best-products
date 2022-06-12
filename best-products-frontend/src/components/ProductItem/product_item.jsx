import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'

class ProductItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="row p-2 bg-white border rounded mt-2 item_container">
                <div className="col-md-3 mt-1"><img className="rounded product_img" src={this.props.product.img_url}></img></div>
                <div className="col-md-6 mt-1">
                    <h5>{this.props.product.title}</h5>
                    <div className="d-flex flex-row">
                        {this.renderStars(this.props.product.stars)}
                        <span> &nbsp;{this.props.product.reviews} reviews</span>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                        <h4 className="mr-1">{this.props.product.price}</h4>
                        {//<span className="strike-text">$20.99</span>
                        }
                    </div>
                    <h6 className="text-success">Free shipping</h6>
                </div>
                <div className="align-items-center align-content-center col-md-3 border-left mt-1">
                    <div className="d-flex flex-column mt-4">
                        <button className="btn btn-primary btn-sm" type="button">Details</button>
                        <button className="btn btn-outline-primary btn-sm mt-2" type="button">Add to wishlist</button>
                        <p>From: {this.props.product.website}</p>
                    </div>
                </div>
            </div>
        )
    }

    renderStars(starInfo) {
        var stars_icons = [];
        var star_num = parseFloat(starInfo.split(" ")[0])
        for (var i = 0; i < 5; i++) {
            if(star_num>=1) {
                stars_icons.push(<i className="bi bi-star-fill yellow"></i>)
            }
            else if (star_num>=0.5) {
                stars_icons.push(<i className="bi bi-star-half yellow"></i>)
            }
            else {
                stars_icons.push(<i className="bi bi-star yellow"></i>)
            }
            star_num--
        }

        return (
            <div className="ratings mr-2">
                {stars_icons}
            </div>
        )
    }
}

export default ProductItem