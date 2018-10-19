import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class Topbar extends Component {
  render() {
    const { classes } = this.props;
    return ( 
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              QR Links
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Topbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Topbar);