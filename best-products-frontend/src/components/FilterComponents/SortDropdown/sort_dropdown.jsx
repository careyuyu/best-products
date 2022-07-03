import React, { Component } from 'react';
import Select from 'react-select';
import './style.css'

const theme = {
    colors: {
      primary: 'hotpink'
    }
  }


class SortDropdown extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Select theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: 'rgb(177, 85, 189)',
                  primary: '#01012b',
                },
              })} 
              className="dropdown_menu neonBorder-purple p-0"
            
                value={this.props.selectedOption}
                onChange={this.props.handleSortChange}
                options={this.props.sortOptions}>
            </Select>
        )
    }
}

export default SortDropdown