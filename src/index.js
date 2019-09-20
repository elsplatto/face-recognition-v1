
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';


import { createMuiTheme } from '@material-ui/core/styles';
import {red, green, purple, orange, yellow, cyan, white} from '@material-ui/core/colors';


import { ThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/styles';

const theme = createMuiTheme({
	palette: {
	  primary: green,
	  secondary: orange
  },
  status: {
    danger: orange,
  },
  typography: {
    useNextVariants: true,
  },
  spacing: x => `${x * 8}px`,
});


const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
});

console.log('Theme: ', theme);

import Store from './js/utilities/store';
import App from './App';

import {createBrowserHistory} from 'history';
const history = createBrowserHistory();



ReactDOM.render(
  <Store>
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>
        <Router history={history} basename={'/'}>
          <Route path="/" component={App} />
        </Router>
      </ThemeProvider>
    </StylesProvider>
  </Store>
  ,    
  document.getElementById('appContainer')
);

// module.hot.accept();