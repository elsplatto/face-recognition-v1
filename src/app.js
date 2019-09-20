import React, { useContext } from 'react';
import '@babel/polyfill';
import { LoggedInStatusContext } from './js/utilities/store';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppHeader from './js/components/app-header';
import FileUploader from './js/components/file-uploader';
import FaceDetection from './js/components/face-detection';
import FaceGenderAge from './js/components/face-gender-age';


const App = (props) => {  

	// console.log('History: ', props.history)
	
	

	const [status] = useContext(LoggedInStatusContext);
	// console.log('status');
	// console.log(status);
	return (
		<>
		<Route path="*" render={(props) => (
			<AppHeader {...props} />
		)}/>
		<Route path="/" exact render={(props) => (
			<FileUploader {...props} status={status} />
		)}/>

		<Route path="/face-detection/:fileId" render={(props) => (
			<FaceDetection {...props} status={status} />
		)}/>

		<Route path="/face-gender-age/:fileId" render={(props) => (
			<FaceGenderAge {...props} status={status} />
		)}/>
	
		</>
	)
	
}

export default App;