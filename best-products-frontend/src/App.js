import React, { Component, Fragment } from 'react';
import ProductList from './components/ProductList/product_list';
import SearchForm from './components/SearchForm/search_form'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          products: [
            ]
      }
  }
  componentDidMount() {

  }

  render() {
    return (
      <Fragment>
        <SearchForm getSearchResult={this.getSearchResult}/>
        <ProductList products={this.state.products}/>
      </Fragment>
    )
  }

  getSearchResult = (event, search_keyword)=> {
    event.preventDefault()

    axios.get("http://localhost:8000/product_search/"+search_keyword).then(res=>{
      const products = res.data
      this.setState({products})
    })
  }
}

export default App;
