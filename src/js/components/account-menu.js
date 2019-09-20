import React, { useState, useContext, useEffect  } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { LoggedInStatusContext, AccountMenuContext } from '../utilities/store';
import {auth} from '../utilities/firebase-config';


const AccountMenu = (props) => {

	const handleMenuCloseProfile = () => {
		setAnchorEl(null);
	}

	const handleMenuCloseSignOut = () => {
		console.log('Signout')
    auth.signOut();
		setStatus({details: null, loading: false});
		setAnchorEl(null);
		props.history.push('/');
		// props.history.push('/projects');
	}

	const handleMenuClose = () => {
		setAnchorEl(null);
	}


  const [status, setStatus] = useContext(LoggedInStatusContext);
  const [anchorEl, setAnchorEl] = useContext(AccountMenuContext);

  const isMenuOpen = Boolean(anchorEl);

	return (
	  <Menu 
	  anchorEl={anchorEl}
	    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
	    id={'primaryAccountMenu'}
	    keepMounted
	    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
	    getContentAnchorEl={null} 
	    open={isMenuOpen}
	    onClose={handleMenuClose}>
	    <MenuItem onClick={handleMenuCloseProfile}>Profile</MenuItem>
	    <MenuItem onClick={handleMenuCloseSignOut}>
	    	Sign out
	    </MenuItem>


	  </Menu>
	)
}

export default AccountMenu;