import React, { Component, Fragment } from 'react';
import ProductItem from '../ProductItem/product_item';
import 'bootstrap/dist/css/bootstrap.min.css';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [
                {"title":"Python Crash Course, 2nd Edition: A Hands-On, Project-Based Introduction to Programming","price":"$23.99","stars":"4.7 out of 5 stars","reviews":"6,672","link":"https://www.amazon.com//gp/slredirect/picassoRedirect.html/ref=pa_sp_atf_aps_sr_pg1_1?ie=UTF8&adId=A0988612879SFQ9SDBFD&url=%2FPython-Crash-Course-Eric-Matthes-ebook%2Fdp%2FB07J4521M3%2Fref%3Dsr_1_1_sspa%3Fkeywords%3Dpython%2Bbook%26qid%3D1654934837%26sr%3D8-1-spons%26psc%3D1&qualifier=1654934837&id=1063607126457717&widgetName=sp_atf","img_url":"https://m.media-amazon.com/images/I/71sL0Qpd+YL._AC_UL320_.jpg","website":"Amazon","comments":[]},
                {"title":"Python Programming: 2 Books in 1: The Ultimate Beginners Guides To Mastering Python Programming with Practical Exercises Quickly (Computer Programming)","price":"$31.99","stars":"4.5 out of 5 stars","reviews":"15","link":"https://www.amazon.com//gp/slredirect/picassoRedirect.html/ref=pa_sp_atf_aps_sr_pg1_1?ie=UTF8&adId=A03111222B6TMPTUOBC9C&url=%2FPython-Programming-Beginners-Mastering-Practical%2Fdp%2FB09VWD3JKV%2Fref%3Dsr_1_2_sspa%3Fkeywords%3Dpython%2Bbook%26qid%3D1654934837%26sr%3D8-2-spons%26psc%3D1&qualifier=1654934837&id=1063607126457717&widgetName=sp_atf","img_url":"https://m.media-amazon.com/images/I/61pMLjTW2CL._AC_UL320_.jpg","website":"Amazon","comments":[]},
                {"title":"Python: For Beginners: A Crash Course Guide To Learn Python in 1 Week","price":"$15.70","stars":"4.4 out of 5 stars","reviews":"2,676","link":"https://www.amazon.com//gp/slredirect/picassoRedirect.html/ref=pa_sp_atf_aps_sr_pg1_1?ie=UTF8&adId=A050987115LB6B8LOD04&url=%2FPython-Beginners-Crash-Course-Guide%2Fdp%2F1549776673%2Fref%3Dsr_1_3_sspa%3Fkeywords%3Dpython%2Bbook%26qid%3D1654934837%26sr%3D8-3-spons%26psc%3D1&qualifier=1654934837&id=1063607126457717&widgetName=sp_atf","img_url":"https://m.media-amazon.com/images/I/61sBcGM3tpL._AC_UL320_.jpg","website":"Amazon","comments":[]} 
            ]
        }
        
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