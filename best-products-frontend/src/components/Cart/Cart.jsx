import { Wrapper } from "./Cart.styles";

import React, { Component, useState } from 'react';
import {Button} from '@mui/material'

class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    
    render() {
        // console.log(this.props)
        return (
            <Wrapper>
                <h3>
                    <span className="badge subtitle_badge py-4 neonBorder-purple neonText cart-title">Your Cart
                    </span>
                </h3>
                {this.props.cart_list.map((value)=>(
                    <CartCard key={value[0]} product={JSON.parse(value[1])} handleClick={()=>this.props.removeCartItem(value[0])}></CartCard>
                ))
                }
            </Wrapper>
        );
    }

}

const CartCard = (props) => {
    // console.log(props)
    const product = props.product;
    const renderPrice = () => {
        if (product.price!=null && product.price.charAt(0) !== '$') {
            return (<a href={product.link} target="_blank">See price</a>)
        }
        else {
            return product.price
        }
    }

    const renderDiscount = ()=> {
        if (product.discount) {
            return (<h6 className="text-danger mb-0" style={{fontSize:"13px"}}>-{product.discount}</h6>)
        }
    }

    const renderTitle = () => {
        if (product.title && product.title.length > 95) {
            return (product.title.substring(0,94)+"...")
        }
        else return product.title
    }

    return (
        <div className="row p-2 mt-2 cart-card">
            <div className="col-md-4 mt-1 px-0"><img className="rounded product_img" src={product.img_url} alt="not available"></img></div>
                <div className="col-md-8 mt-1 d-flex align-items-start flex-column mb-1 px-0">
                    <div className="mb-auto py-0 title-section px-1">
                        <h6><a className="link-unstyled" href={product.link} target="_blank" style={{fontSize:"14px"}}>{renderTitle()}</a></h6>
                    </div>
                <div className="d-flex flex-row justify-content-start" style={{fontSize:"14px", width:"100%"}}>
                    {renderPrice()}{renderDiscount()}   {<Button sx={{"paddingTop":"0", "paddingBottom":"0", marginLeft:"auto"}} onClick={props.handleClick}>Delete</Button>}</div>
            </div>
        </div>
    )
}

    
  

export default Cart;
