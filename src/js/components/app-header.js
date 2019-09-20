import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import GoogleLogin from './google-login';


import { LoggedInStatusContext } from '../utilities/store';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const AppHeader = (props) => {  
  const classes = useStyles();  
  return (
    <> 
  	<AppBar id="appBar" position={'fixed'} color={'primary'}>
    <Toolbar>
        {
        status.details ? 
        <IconButton onClick={toggleDrawer} edge={'start'} className={classes.menuButton} color={'inherit'} aria-label="Menu">
          <MenuIcon  />
        </IconButton>
        :
        null 
        }
        <Typography variant="h6" className={classes.title} color={'textPrimary'}>
         Face API
        </Typography>
        <GoogleLogin {...props} />
      </Toolbar>
		</AppBar>
    </>
  )
}

export default AppHeader;