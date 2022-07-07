import React, { Component } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import './style.css'

class NavBar extends Component {
    render() {
        return (
            <Box>
              <AppBar position="static" color="primary">
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, color:"white"}} className="neonText">
                    <b>Compare-&-Buy</b>
                  </Typography>
                  <a href="https://github.com/careyuyu/compare-and-buy" target='_blank' style={{"color": "inherit", "textDecoration": "inherit"}}><i className="bi bi-github fa-2x"></i></a>
                </Toolbar>
              </AppBar>
            </Box>
          );
    }
}   

export default NavBar