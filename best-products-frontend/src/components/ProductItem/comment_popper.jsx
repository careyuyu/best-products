import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import { FixedSizeList } from 'react-window';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './popper_style.css'

class CommentPopper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }

    render() {
        const handleClick = (event) => {
            console.log(this.props.url)
            this.props.getComments()
            console.log(this.props.comments)
            const anchorEl = this.state.anchorEl ? null : event.currentTarget
          this.setState({anchorEl});
        };
      
        const open = Boolean(this.state.anchorEl);
        const id = open ? 'comment-popper' : undefined;
        return (    
        <div>
            <button aria-describedby={id} className="btn btn-primary btn-sm mt-2" type="button" onClick={handleClick}>
              Top reviews
            </button>
            <Popper id={id} open={open} anchorEl={this.state.anchorEl} placement="right">
              <Box sx={{ border: 1, borderColor: 'grey.400', borderRadius: 1, p: 1, bgcolor: 'background.paper', width: '100%', height: 220, maxWidth: 500, boxShadow: 3}}>
                 <div className="container popper_window overflow-auto">
                    {this.props.comments.map((comment)=>(
                        <div className="card">
                            <div className="card-body popper_window_card overflow-auto my-2 py-0">
                                <h6 className="card-title pt-0"><small><b>{comment.title}</b></small></h6>
                                <div className="d-flex flex-row align-items-center">
                                 <p className="card-subtitle text-muted"><small>By {comment.author} &nbsp;</small></p>
                                 {this.renderStars(comment.stars)}
                                </div>
                                <p className="card-text"><small>{comment.detail}</small></p>
                            </div>
                        </div>
                    ))}
                </div>
               
              </Box>
            </Popper>
        </div>)
    }

    renderStars(stars) {
        var stars_icons = [];
        var star_num = stars?parseFloat(stars.split(" ")[0]):0.0
        for (var i = 0; i < 5; i++) {
            if(star_num>=1) {
                stars_icons.push(<i className="bi bi-star-fill yellow" key={i}></i>)
            }
            else if (star_num>=0.5) {
                stars_icons.push(<i className="bi bi-star-half yellow" key={i}></i>)
            }
            else {
                stars_icons.push(<i className="bi bi-star yellow" key={i}></i>)
            }
            star_num--
        }

        return (
            <div className="ratings mr-2">
                {stars_icons}
            </div>
        )
    }
}

export default CommentPopper