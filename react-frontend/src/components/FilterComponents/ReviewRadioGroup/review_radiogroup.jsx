import React, { Component } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import 'bootstrap-icons/font/bootstrap-icons.css'

class ReviewRadiogroup extends Component {

    render() {
        return (
        <FormControl>
            <RadioGroup
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={this.handleOnchange}
              value={this.props.selectedvalue}
            >
              <FormControlLabel value="4" control={<Radio />} label={this.renderStars(4)} />
              <FormControlLabel value="3" control={<Radio />} label={this.renderStars(3)} />
              <FormControlLabel value="2" control={<Radio />} label={this.renderStars(2)} />
              <FormControlLabel value="1" control={<Radio />} label={this.renderStars(1)} />
              <FormControlLabel value="0" control={<Radio />} label="All" />
            </RadioGroup>
          </FormControl>
        )
    }

    renderStars(number) {
        var stars_icons = [];
        for (var i = 0; i<number; i++) {
            stars_icons.push(<i className="bi bi-star-fill yellow" key={i}></i>)
        }
        for (var i = 5; i > number; i--) {
            stars_icons.push(<i className="bi bi-star yellow" key={i+5}></i>)
        }
        return (
            <div>{stars_icons} & up</div>
        )
    }

    handleOnchange = (selected) => {
       this.props.setFilter("star", selected.target.value)
    }
}

export default ReviewRadiogroup