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
            <div className="container mt-5" onSubmit={(event)=>this.props.getSearchResult(event, this.state.search_keyword)}>
                <form>
                    <div className="form-group">
                        <input type="input" className="form-control" id="product_keyword" placeholder="Search for products" 
                        value={this.state.search_keyword} onChange={(event)=>this.setState({search_keyword: event.target.value})}></input>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1"></input>
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                    </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
            </div>
        )
    }
}

export default SearchForm;