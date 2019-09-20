import React, { useState } from 'react';

export const LoggedInStatusContext = React.createContext(null);
export const AccountMenuContext = React.createContext(null);

const Store = ({children}) => {
	const [status, setStatus] = useState({details: undefined, loading: true});
	const [anchorEl, setAnchorEl] = useState(null);
	// const [sessionValues, setSessionValues] = useState(null);
	// const [posting, setPostingStatus] = useState(null);
	// const [drawerStatus, setDrawerStatus] = useState(false);
	return (  
				    
    <LoggedInStatusContext.Provider value={[status, setStatus]}>     
      <AccountMenuContext.Provider value={[anchorEl, setAnchorEl]}>
        {children}
      </AccountMenuContext.Provider>
    </LoggedInStatusContext.Provider>
          				
	)	
}

export default Store;