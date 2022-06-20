import React, { Component } from 'react';
import Select from 'react-select';
import './style.css'

class SortDropdown extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Select className="dropdown_menu"
                value={this.props.selectedOption}
                onChange={this.props.handleSortChange}
                options={this.props.sortOptions}>
            </Select>
        )
    }
}

export default SortDropdown