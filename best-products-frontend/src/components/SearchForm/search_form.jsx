import React, { Component } from 'react';
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
            <div className="container mt-5 p-5 border rounded" onSubmit={(event)=>this.props.getSearchResult(event, this.state.search_keyword)}>
                <form className="mx-5">
                    <div className="form-group d-flex flex-row searchInputRow justify-content-center">
                        <input type="input" className="form-control mx-3" id="product_keyword" placeholder="Search for products" 
                        value={this.state.search_keyword} onChange={(event)=>this.setState({search_keyword: event.target.value})}></input>
                        <button type="submit" className="btn btn-primary">Search</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default SearchForm;