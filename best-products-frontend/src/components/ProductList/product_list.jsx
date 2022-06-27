import React, { Component, Fragment } from 'react';
import ProductItem from '../ProductItem/product_item';
import 'bootstrap/dist/css/bootstrap.min.css';
import SortDropdown from '../FilterComponents/SortDropdown/sort_dropdown'
import {LinearProgress } from '@mui/material';

class ProductList extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <Fragment>
                <div className="container mt-1 mb-5">
                    <div className="d-flex justify-content-center row">
                        <div className="col-md-12" style={{"maxWidth":"1000px"}}>
                            {this.props.loadingData && 
                            <div className="mb-4">
                                <div className="d-flex justify-content-center mb-2 neonText">Loading Data</div>
                                <LinearProgress></LinearProgress>
                            </div>}
                            <div className="d-flex justify-content-end align-items-center">
                            <h5 className="neonText-purple mr-2">Sort by</h5>
                            </div>
                            <div className="d-flex justify-content-end align-items-center">
                                {this.props.product_full.length!==0 && 
                                <SortDropdown handleSortChange={this.props.handleSortChange} selectedOption={this.props.selectedOption} 
                                sortOptions={this.props.sortOptions}></SortDropdown>}
                            <br/>
                            </div>
                                {this.props.products.map((value, index)=>(
                                    <ProductItem key={value.title+index} product={value}></ProductItem>
                                )
                                )}
                            <br/><br/><br/><br/><br/>
                            </div>
                    </div>
                </div>
            </Fragment>
        )
    }

}

export default ProductList