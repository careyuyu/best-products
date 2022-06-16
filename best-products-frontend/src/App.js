import React, { Component, Fragment } from 'react';
import ProductList from './components/ProductList/product_list';
import SearchForm from './components/SearchForm/search_form'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          products_full: [],
          products_filtered:[],
          loading_data: false,
          sort_by: "default"
      }
  }
  componentDidMount() {

  }

  sortResultBy(category) {
    var products_filtered = this.state.products_filtered
    if (category === "discount") {
      products_filtered.sort((a,b)=>{
        var discount_a = parseInt(a.discount.substr(0, a.discount.length-1)) || 0
        var discount_b = parseInt(b.discount.substr(0, b.discount.length-1)) || 0
        return (discount_a < discount_b?1:-1)
      })
    }
    else if(category === "review") {
      products_filtered.sort((a,b)=>{
        var review_a = parseInt(a.reviews.split(',').join('')) || 0
        var review_b = parseInt(b.reviews.split(',').join('')) || 0
        return (review_a < review_b?1:-1)
      })
    }
    else if(category === "rating") {
      products_filtered.sort((a,b)=>{
        var star_a = a.stars?parseFloat(a.stars.split(" ")[0]):0.0
        var star_b = b.stars?parseFloat(b.stars.split(" ")[0]):0.0
        if (star_a == star_b) {
          var review_a = parseInt(a.reviews.split(',').join('')) || 0
          var review_b = parseInt(b.reviews.split(',').join('')) || 0
          return (review_a < review_b?1:-1)
        }
        return (star_a < star_b?1:-1)
      })
    }
    this.setState({products_filtered})
  }

  getSearchResult = (event, search_keyword)=> {
    event.preventDefault()
    this.setState({loading_data: true})
    axios.get("http://localhost:8000/product_search/"+search_keyword).then(res=>{
      var products = res.data
      products.sort((a,b)=>{
        var review_a = parseInt(a.reviews.split(',').join('')) || 0
        var review_b = parseInt(b.reviews.split(',').join('')) || 0
        console.log(review_a)
        return (review_a < review_b?1:-1)
      })
      this.setState({products:products, products_filtered:products, loading_data:false})
      //this.sortResultBy("review")
    })
  }

  render() {
    return (
      <Fragment>
        <SearchForm getSearchResult={this.getSearchResult}/>
        <button className="btn btn-primary" onClick={()=>this.sortResultBy("rating")}>Test</button>
        <ProductList products={this.state.products_filtered}/>
      </Fragment>
    )
  }

}

export default App;
