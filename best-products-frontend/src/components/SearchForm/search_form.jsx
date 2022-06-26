import React, { Component } from 'react';
import {TextField, Button} from '@mui/material'
import './style.css'
import DealCarousel from '../DealCarousel/deal_carousel'

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_keyword: ""
        }
    }

    render() {
        return (
            <div className="container mt-5 p-5 border rounded neon_search_form" onSubmit={(event)=>this.props.getSearchResult(event, this.state.search_keyword)}>
                <form className="mx-5">
                    <div className="d-flex flex-row align-items-center justify-content-center"><h3 className="neonText-purple">Compare-&-Buy</h3></div>
                    <br></br>
                    <div className="form-group d-flex flex-row searchInputRow justify-content-center">
                        <TextField label="Product Name" variant="outlined" type="input" className="mx-3" id="product_keyword" sx={{width:"80%"}} 
                        value={this.state.search_keyword} onChange={(event)=>this.setState({search_keyword: event.target.value})}></TextField>
                        <Button type="submit" size="" className="btn" variant="contained">Search</Button>
                    </div>
                    <div className="d-flex flex-row">
                        <DealCarousel></DealCarousel>
                    </div>
                </form>
            </div>
        )
    }
}

export default SearchForm;