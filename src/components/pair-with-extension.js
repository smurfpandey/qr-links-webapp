import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

import { Socket } from '../SocketHandler';
import { Peer } from '../PeerHandler';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100vw'
  },
  container: {
    textAlign: 'center'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95vw'
  },
  input: {
    textTransform: 'uppercase'
  },
  btnHolder: {
    marginTop: 20,
    position: 'relative',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class PairWithExtension extends Component {
  state = {
    loading: false,
    success: false,
    peerId: ''
  };
  
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handlePeerIdChange = event => {
    this.setState({ peerId: event.target.value });
  };

  handlePairClick = () => {
    if (this.state.loading) {
      return;
    }
    let peerId = this.state.peerId;

    if(!peerId) {
      return;
    }

    peerId = peerId.toUpperCase();
    Socket.emit('DO_I_HAVE_A_OFFER', { peerId: peerId }, (data) => {
      if(!data.offerData) {
        return;
      }

      Peer.on('signal', (answerData) => {
        // send answer to socket
        Socket.emit('I_HAVE_AN_ANSWER', { answer: answerData, peerId: peerId }, (data) => {

        })
      });
      Peer.signal(data.offerData);
    });


      this.setState(
        {
          success: false,
          loading: true,
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState({
              loading: false,
              success: true,
            });
          }, 2000);
        },
      );
    
  };

  render() {
    const { loading } = this.state;
    const { classes } = this.props;
    return ( 
      <div className={classes.root}>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="pair-code"
            label="Pair Code"
            value={this.state.peerId}
            className={classes.textField}
            inputProps={{
              className: classes.input
            }}
            margin="normal"
            variant="outlined"
            onChange={this.handlePeerIdChange}
          />
          <div className={classes.btnHolder}>
            <Button variant="contained" color="primary" className={classes.button}
              onClick={this.handlePairClick} 
              disabled={loading}>
                <LinkIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Pair
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </form>
      </div>
    );
  }
}

PairWithExtension.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PairWithExtension);