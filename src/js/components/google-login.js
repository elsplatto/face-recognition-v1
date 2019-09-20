import React, { useState, useContext, useEffect } from 'react';
import { LoggedInStatusContext, AccountMenuContext } from '../utilities/store';
import {provider, auth} from '../utilities/firebase-config';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import AccountMenu from './account-menu';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: '42px',
    height: '42px',
    border: '1px solid transparent',
    borderRadius: '50%',
  },
  circProgress: {
    width: '44px',
    height: '44px'
  },
  loginArea: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarBtn: {
    padding: '4px !important'
  }
}));

const GoogleLogin = (props) => {  
  const [status, setStatus] = useContext(LoggedInStatusContext);
  const [anchorEl, setAnchorEl] = useContext(AccountMenuContext);
  const classes = useStyles();

  const login = () => {
    auth.signInWithPopup(provider) 
    .then((result) => {
      const user = result.user;
      // console.log('User ID: ', user.uid);
      if (user.uid) {
        // console.log('User obj: ', user);
        setStatus({details: user, loading: false});
        // props.history.push('/projects');
      }
    });
  }
  
  
  const toggleAccountMenu = (e) => {
    // console.log('toggleMenu')
    // console.log(e.currentTarget)
    setAnchorEl(e.currentTarget)
  }

  useEffect(() => {
    // console.log('Loading')
    auth.onAuthStateChanged((user) => {
      // console.log('onAuthStateChanged - user:', user);
      if (user && status.details === undefined) {
        setStatus({details: user, loading: false});
        // console.log('user && status.details === undefined: TRUE');
        // console.log('User: ', user);
        // console.log('status.details: ', status.details);
      }
      else if (!user && status.details === undefined) {
        // console.log('!user && status.details === undefined: TRUE');
        // console.log('User: ', user);
        // console.log('status.details: ', status.details);
        setStatus({details: null, loading: false})
      }
      
    });
  });

  
  if (!status.details && !status.loading)
  {
    return (
      <Button onClick={login}>Sign in with Google</Button>      
    )
   
  }
  else if (!status.details && status.loading) {
    return (
      <div className={classes.loginArea}>
        <CircularProgress className={classes.circProgress} />
      </div>
    )
  }
  else {
    return (
      <div className={classes.loginArea}>
        <IconButton className={classes.avatarBtn} onClick={toggleAccountMenu}>
          <img src={status.details.photoURL} className={classes.avatar} id={'avatarImg'} />
        </IconButton>
        <AccountMenu {...props} />
      </div>
    )
  }
}

export default GoogleLogin;