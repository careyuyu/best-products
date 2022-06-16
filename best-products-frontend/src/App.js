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
          sort_by: "review",
          website_filters: {
            amazon: true,
            ebay: true,
            target: true
          }
      }
  }
  componentDidMount() {

  }

  //sort the product list based on selection
  sortResultBy(category, list) {
    var products_filtered = list || this.state.products_filtered
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

  //filter the product list
  setFilter(category) {
    var website_filters = this.state.website_filters
    if (category=="amazon") {
      website_filters.amazon = !website_filters.amazon
      this.setState({website_filters})
      this.filterWebsite("Amazon", website_filters.amazon)
    }
    else if (category=="ebay") {
      website_filters.ebay = !website_filters.ebay
      this.setState({website_filters})
      this.filterWebsite("ebay", website_filters.ebay)
    }
  }

  //filter the source website of product (amazon, ebay, etc)
  filterWebsite(website, add) {
    var products_filtered = this.state.products_filtered
    const products_full = this.state.products_full
    if (!add) {
      products_filtered = products_filtered.filter((product)=>{
        return product.website != website
      })
    }
    else {
      const addedContent = products_full.filter((product)=>{
        return product.website == website
      })
      products_filtered =products_filtered.concat(addedContent)
    }
    this.sortResultBy(this.state.sort_by, products_filtered)
  }

  //retrive data from backend api
  getSearchResult = (event, search_keyword)=> {
    event.preventDefault()
    this.setState({loading_data: true})
    axios.get("http://localhost:8000/product_search/"+search_keyword).then(res=>{
      var products = res.data
      products.sort((a,b)=>{
        var review_a = parseInt(a.reviews.split(',').join('')) || 0
        var review_b = parseInt(b.reviews.split(',').join('')) || 0
        return (review_a < review_b?1:-1)
      })
      const website_filters = {
        amazon: true,
        ebay: true,
        target: true
      }
      this.setState({products_full:products, products_filtered:products, loading_data:false, website_filters})
      //this.sortResultBy("review")
    })
  }

  render() {
    return (
      <Fragment>
        <SearchForm getSearchResult={this.getSearchResult}/>
        {this.renderSortDiv()}
        {this.renderFilterDiv()}
        <ProductList products={this.state.products_filtered}/>
      </Fragment>
    )
  }

  renderFilterDiv() {
    if (this.state.products_full.length > 0) {
      return (      
        <div className="container col-1" style={{width:"200px", float:"left", "margin-top":"50px", "margin-left":"20px"}}>
          <h5><b>Filters</b></h5>
          <b>From:</b>
          <div className="d-flex flex-row">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" checked={this.state.website_filters.amazon} onClick={()=>{this.setFilter("amazon")}}></input>
                <label class="form-check-label" for="flexCheckChecked">
                  Amazon
                </label>
            </div>
          </div>
          <div className="d-flex flex-row">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" checked={this.state.website_filters.ebay} onClick={()=>{this.setFilter("ebay")}}></input>
                <label class="form-check-label" for="flexCheckChecked">
                  Ebay
                </label>
            </div>
          </div>
          <div className="d-flex flex-row">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" checked></input>
                <label class="form-check-label" for="flexCheckChecked">
                  Target
                </label>
            </div>
          </div>
        </div>)
    }
  }

  renderSortDiv() {
    if (this.state.products_full.length > 0) {
      return (
        <div className="d-flex flex-row border-top mt-4 mx-5 p-2">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown button
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" href="#">Action</a>
              <a className="dropdown-item" href="#">Another action</a>
              <a className="dropdown-item" href="#">Something else here</a>
            </div>
          </div>
        </div>
      )
    }
  }

}

export default App;
