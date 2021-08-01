
import React from 'react';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {BrowserRouter as Router} from 'react-router-dom';
import Box from '@material-ui/core/Box'

import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Download from './components/Download';
import Footer from './components/Footer';


import {
  theme,
  useStyles
} from './style/CustomStyle';

function App(props) {
  // get the style
  const classes = useStyles();

  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <div className={classes.root}>

          {/* header */}
          <Box>
            <Header />
          </Box>

          {/* add File Upload Pane */}
          <Box pt={10}>
            <FileUpload classes={classes} />
          </Box>
          
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
