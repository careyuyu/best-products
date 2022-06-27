import React, { Component } from 'react';
import {TextField, Button} from '@mui/material'
import './style.css'

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_keyword: ""
        }
    }

    render() {
        return (
            <div className="container-fluid p-5 grad1" onSubmit={(event)=>this.props.getSearchResult(event, this.state.search_keyword)}>
                <form className="mx-5">
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        <h1>
                            <span className="badge title_badge py-4 neonBorder-purple neonText">Compare-&-Buy
                            </span>
                        </h1>
                    </div>
                    <br></br>
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        <h4>
                            <span className="badge small_badge py-2 neonBorder-purple neonText mb-2 px-3">
                                Search & compare products on top e-commerce sites
                            </span>
                        </h4>
                    </div>
                    <div className="form-group d-flex flex-row searchInputRow justify-content-center mt-3">
                        <TextField label="Product Name" variant="outlined" type="input" className="mx-3" id="product_keyword" sx={{width:"80%"}} 
                        value={this.state.search_keyword} onChange={(event)=>this.setState({search_keyword: event.target.value})}></TextField>
                        <Button type="submit" size="" className="btn" variant="contained">Search</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default SearchForm;