import React, { Component, Fragment } from 'react';
import ProductItem from '../ProductItem/product_item';
import 'bootstrap/dist/css/bootstrap.min.css';

class ProductList extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <Fragment>
                <div className="container mt-5 mb-5">
                    <div className="d-flex justify-content-center row">
                        <div className="col-md-10">
                                {this.props.products.map((value, index)=>(
                                    <ProductItem key={index} product={value}></ProductItem>
                                )
                                )}
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

}

export default ProductList