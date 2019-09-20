import React, { useState, useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { DrawerContext } from '../store/store';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {

  },
  title: {
    flexGrow: 1
  },
  left: {
    width: 250,
  	left: 0
  },
  list: {
    width: 250,
    marginTop: theme.spacing(10)
  },
  topMargin: {
  	paddingTop: theme.spacing(8) + ' !important'
  }
}));


const LeftDrawer = (props) => {

	

	const toggleDrawer = (event) => {
    // console.log('event', event)
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerStatus(!drawerStatus);
  };

  const [drawerStatus, setDrawerStatus] = useContext(DrawerContext);

  const classes = useStyles();
          	

  return (
      <Drawer open={drawerStatus} onClose={toggleDrawer}>      	
        <div className={classes.list} role={'presentation'} onClick={toggleDrawer}  onKeyDown={toggleDrawer}>
	        <AppBar id="leftDrawerAppBar" position={'fixed'} color={'default'} className={classes.left}>
	        	<Toolbar>
	      			<IconButton onClick={toggleDrawer} edge={'start'} className={classes.menuButton} color={'inherit'} aria-label="Menu">
			          <Close  />
			        </IconButton>
			        <Typography variant="h6" noWrap={true}>
			        	Reaction Cards
			        </Typography>
	      		</Toolbar>
	      	</AppBar>
        <Divider />        
      </div>
    </Drawer>
  )
}

export default LeftDrawer;