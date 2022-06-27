import React, { Component } from 'react';
import Select from 'react-select';
import './style.css'

const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      borderBottom: '1px dotted pink',
      color: state.isFocused ? 'purple' : 'black'
    }),
  
  }

class SortDropdown extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Select menuColor='red' styles={customStyles} className="dropdown_menu"
                value={this.props.selectedOption}
                onChange={this.props.handleSortChange}
                options={this.props.sortOptions}>
            </Select>
        )
    }
}

export default SortDropdown