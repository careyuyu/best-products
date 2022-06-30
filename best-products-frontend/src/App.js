import React, { Component, Fragment } from 'react';
import ProductList from './components/ProductList/product_list';
import SearchForm from './components/SearchForm/search_form';
import ReviewRadiogroup from './components/FilterComponents/ReviewRadioGroup/review_radiogroup';
import NavBar from './components/Navbar/navbar'
import Cart from './components/Cart/Cart'
import { TextField, Checkbox, FormControlLabel, Drawer, Fab} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import theme from './style'

import axios from 'axios'


const sortOptions = [
  { value: 'review', label: 'Reviews: highest first' },
  { value: 'discount', label: 'Discount: highest first' },
  { value: 'rating', label: 'Rating: highest first' },
  { value: 'price_l', label: 'Price: lowest first'},
  { value: 'price_h', label: 'Price: highest first'}
];

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          products_full: [],
          products_filtered:[],
          cart_item: Map,
          cart_list: [],
          loading_data: false,
          sort_by: "review",
          filters: {
            amazon: true,
            ebay: true,
            target: true,
            sale: false,
            min: 0,
            max: 0,
            star: 0,
            review: 0
          },
          selectedSortOption: sortOptions[0],
          resultTitle: "",
          cartOpen: false,
      }
  }
  componentDidMount() {
    //load today's deal data
    this.getTodayDeal()
    //load cart item
    this.getCartItem()
  }
  render() {
    return (
      <Fragment>
        <ThemeProvider theme={theme}>
            <NavBar></NavBar>
            <div className='container-fluid px-0'>
              <SearchForm getSearchResult={this.getSearchResult}/>
              <div className='d-flex flex-row justify-content-center mt-5'>{this.renderResultTitle()}</div>
              {this.renderFilterDiv()}
              <div className='container mt-2' style={{"padding-left":"1000px;"}}>
                <ProductList products={this.state.products_filtered} loadingData={this.state.loading_data}
                  handleSortChange={this.handleSortChange} selectedOption={this.state.selectedSortOption} 
                  sortOptions={sortOptions} product_full={this.state.products_full} updateCartItem={this.updateCartItem}/>
              </div>
              <Drawer anchor="right" open={this.state.cartOpen} onClose={() => this.setState({cartOpen: false})}>
                <Cart cart_list={this.state.cart_list} updateCartItem={this.updateCartItem} removeCartItem={this.removeCartItem}/>
              </Drawer>
              <Fab variant="extended" style={{"position":"fixed", bottom: "25px", "right":"25px"}} onClick={()=>this.setState({cartOpen:true})}>
                <i className="bi bi-cart"></i>Shopping Cart
              </Fab>
            </div>
        </ThemeProvider>
      </Fragment>
    )
  }

  //get cart items from localStorage
  getCartItem=()=> {
    const cart_item = new Map()
    for (var key in localStorage){
      const product = localStorage.getItem(key)
      if (product) {
        cart_item.set(key, product)
      }
   }
   const cart_list = Array.from(cart_item)
   this.setState({cart_item, cart_list})
  }

  updateCartItem=(key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
    const cart_item = this.state.cart_item
    cart_item.set(key, JSON.stringify(value))
    const cart_list = Array.from(cart_item)
    this.setState({cart_item, cart_list})
  }

  removeCartItem=(key) => {
    localStorage.removeItem(key)
    const cart_item = this.state.cart_item
    cart_item.delete(key)
    const cart_list = Array.from(cart_item)
    this.setState({cart_item, cart_list})
  }

  //sort the product list based on category
  sortResultBy = (category, list) => {
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
    else if(category==="price_l" || "price_h") {
      products_filtered.sort((a,b)=>{
        var price_a = parseFloat(a.price.substring(1, a.price.length).split(',').join('')) || parseFloat(a.prev_price.substring(1, a.prev_price.length).split(',').join(''))
        var price_b = parseFloat(b.price.substring(1, b.price.length).split(',').join('')) || parseFloat(b.prev_price.substring(1, b.prev_price.length).split(',').join(''))
        if (category==="price_l") {
          return (price_b < price_a?1:-1)
        }
        return (price_a < price_b?1:-1)
      })
    }
    this.setState({sort_by:category, products_filtered})
  }

  //handle change method for sort button
  handleSortChange = (selectedSortOption) => {
    this.setState({ selectedSortOption }, () =>
      this.sortResultBy(this.state.selectedSortOption.value)
    );
  };

  //filter the result list based on setting
  setFilter=(option, value)=> {
    var newSetting = this.state.filters
    if (value!=null) {
      newSetting[option] = parseInt(value) || 0
    }
    else {
      newSetting[option] = !newSetting[option]
    }
    this.setState({filters:newSetting})
    this.applyFilter()
  }


  //apply the filter setting to the current list
  applyFilter() {
    const filters = this.state.filters
    var products_filtered = this.state.products_full
    if (!filters.amazon) {
      products_filtered = products_filtered.filter((product)=>{
        return product.website != "Amazon"
      })
    }
    if(!filters.ebay) {
      products_filtered = products_filtered.filter((product)=>{
        return product.website != "ebay"
      })
    }
    if (!filters.target) {
      products_filtered = products_filtered.filter((product)=>{
        return product.website != "target"
      })
    }
    if (filters.review != 0) {
      products_filtered = products_filtered.filter((product)=>{
        const review = product.reviews?parseInt(product.reviews.split(",").join('')):0.0
        return review >= filters.review
      })
    }
    if (filters.sale) {
      products_filtered = products_filtered.filter((product)=>{
        return product.prev_price != "" || null
      })
    }
    if (filters.min != 0) {
      products_filtered = products_filtered.filter((product)=>{
        const price = parseFloat(product.price.substring(1, product.price.length).split(',').join('')) || parseFloat(product.prev_price.substring(product, product.prev_price.length).split(',').join(''))
        return price >= filters.min
      })
    }
    if (filters.max != 0) {
      products_filtered = products_filtered.filter((product)=>{
        const price = parseFloat(product.price.substring(1, product.price.length).split(',').join('')) || parseFloat(product.prev_price.substring(product, product.prev_price.length).split(',').join(''))
        return price <= filters.max
      })
    }
    if (filters.star != 0) {
      products_filtered = products_filtered.filter((product)=>{
        const star = product.stars?parseFloat(product.stars.split(" ")[0]):0.0
        return star >= filters.star
      })
    }


    //sort the filtered result to be consistent with prev setting
    this.sortResultBy(this.state.sort_by, products_filtered)
  }


  //retrive product data from backend api
  getSearchResult = (event, search_keyword)=> {
    event.preventDefault()
    this.setState({loading_data: true})
    axios.get("http://localhost:8000/product_search/"+search_keyword).then(res=>{
      var products = res.data
      //set default value for undefined attributes
      products.map((a)=>{
        a.reviews = a.reviews?a.reviews:"0.0"
      })
      products.sort((a,b)=>{
        var review_a = parseInt(a.reviews.split(',').join('')) || 0
        var review_b = parseInt(b.reviews.split(',').join('')) || 0
        return (review_a < review_b?1:-1)
      })
      const filters= {
        amazon: true,
        ebay: true,
        target: true,
        sale: false,
        min: 0,
        max: 0,
        star: 0,
        review: 0
      }
      const selectedSortOption = sortOptions[0];
      const resultTitle = "Search Results"
      this.setState({products_full:products, products_filtered:products, loading_data:false, filters, selectedSortOption, resultTitle})
      //this.sortResultBy("review")
    })
  }

  //retrive today's deal data from backend api
  getTodayDeal=()=> {
    this.setState({loading_data: true})
    axios.get("http://localhost:8000/get_deal").then(res=>{
      var products = res.data
      //set default value for undefined attributes
      products.sort((a,b)=>{
        var discount_a = parseInt(a.discount.substr(0, a.discount.length-1)) || 0
        var discount_b = parseInt(b.discount.substr(0, b.discount.length-1)) || 0
        return (discount_a < discount_b?1:-1)
      })
      const filters= {
        amazon: true,
        ebay: true,
        target: true,
        sale: false,
        min: 0,
        max: 0,
        star: 0,
        review: 0
      }
      const selectedSortOption = sortOptions[1];
      const resultTitle = "Today's Top Deals"
      this.setState({products_full:products, products_filtered:products, loading_data:false, filters, selectedSortOption, sort_by:"discount", resultTitle})
    })
  }

  //the title for the result div
  renderResultTitle() {
    return (
      <h1><span className="badge subtitle_badge py-3 neonBorder-purple neonText">{this.state.resultTitle}</span></h1>)
  }

  //********the filter div***********
  renderFilterDiv() {
    if (this.state.products_full.length > 0) {
      return (      
        <div className="container col-1" style={{ "marginTop": "80px", width:"250px", float:"left", "marginLeft":"20px", "marginRight":"50px"}}>
        <h4 className="neonText-purple">Filters</h4>
        <div className="neonBorder-purple py-3 px-3" style={{"backgroundColor":"white"}}>
          <b>From:</b>
          <div className="d-flex flex-row">
             <FormControlLabel control={<Checkbox checked={this.state.filters.amazon} onClick={()=>this.setFilter("amazon")}/>} label="Amazon" />
          </div>
          <div className="d-flex flex-row">
            <FormControlLabel control={<Checkbox checked={this.state.filters.ebay} onClick={()=>this.setFilter("ebay")}/>} label="Ebay" />
          </div>
          <div className="d-flex flex-row">
            <FormControlLabel control={<Checkbox checked={this.state.filters.target} onClick={()=>this.setFilter("target")}/>} label="Target" />
          </div>

          <br></br>
          <b>Price:</b>
          <div className="d-flex flex-row align-items-center mt-2">
            <TextField size="small" label="Min" variant="outlined" 
              value={this.state.filters.min==0?"":this.state.filters.min} 
              onChange={(e)=>this.setFilter("min", e.target.value.replace(/[^0-9]/g, '') || 0.0)}/>
            <div>&nbsp;to&nbsp;</div>
            <TextField size="small" label="Max" variant="outlined" 
              value={this.state.filters.max==0?"":this.state.filters.max} 
              onChange={(e)=>this.setFilter("max", e.target.value.replace(/[^0-9]/g, '') || 0.0)}/>
          </div>
          <div className="d-flex flex-row">
            <FormControlLabel control={<Checkbox checked={this.state.filters.sale} onClick={()=>this.setFilter("sale")}/>} label="On Sale" />
          </div>

          <br></br>
          <b>Customer Review:</b>
          <div className="d-flex flex-row align-items-center mt-2">
            <ReviewRadiogroup setFilter={this.setFilter} selectedvalue={this.state.filters.star}></ReviewRadiogroup>
          </div>
          <div className="d-flex flex-row align-items-center mt-2">
            <h6>{"Reviews more than:"}</h6>
          </div>
          <div className="d-flex flex-row align-items-center mt-2">
            <TextField size="small" label="Reviews" sx={{ width: '10ch'}}
              value={this.state.filters.review==0?"":this.state.filters.review} 
              onChange={(e)=>this.setFilter("review", e.target.value.replace(/[^0-9]/g, '') || 0.0)}/>
          </div>
        </div>
        </div>
        )
    }
  }

}

export default App;
