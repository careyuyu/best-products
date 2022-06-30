import React, { Component } from 'react';
import Select from 'react-select';
import './style.css'

const customStyles = {
    option: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      border: 'red',
    }),
    menu: (provided, state) => ({
        ...provided,
        width: state.selectProps.width,
        borderBottom: '1px dotted pink',
        color: 'pink',
    }),
  
  }

class SortDropdown extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Select styles={customStyles} className="dropdown_menu neonBorder-purple p-0"
                value={this.props.selectedOption}
                onChange={this.props.handleSortChange}
                options={this.props.sortOptions}>
            </Select>
        )
    }
}

export default SortDropdown