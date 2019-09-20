import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import firebaseConfig from '../utilities/firebase-config';

import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import ImagesView from './image-view';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);



const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(10)
  }
});


class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.storageRef = firebaseConfig.storage().ref();
    this.databaseRef = firebaseConfig.firestore();
    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [], // is used to store file upload information
      uploadValue :  0 , // Used to view the process. Upload
      filesMetadata : [], // draw the DataTable
      msg:'',
      picture: ''
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.status !== this.props.status) {
    //   console.log('Logged in status changed: ', this.props.status)
    // }
  }

  handleInit() {
    // console.log("FilePond instance has initialised", this.pond);
  }

  handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    // handle file upload here
    // console.log(" handle file upload here");
    // console.log(this.storageRef.child(file.name).fullPath);

    const fileUpload = file;
    
    const task = this.storageRef.child(file.name).put(fileUpload)

    task.on(`state_changed` , (snapshort) => {
      console.log(snapshort.bytesTransferred, snapshort.totalBytes)
      let percentage = (snapshort.bytesTransferred / snapshort.totalBytes) * 100;
      //Process
      this.setState({
          uploadValue: percentage
      })
    } , (error) => {
        //Error
        this.setState({
            msg:`Upload error : ${error.message}`
        })
    } , () => {
        //Success
        this.setState({
            msg: `Upload Success`,
            picture: task.snapshot.downloadURL 
        });

        //Get metadata
        this.storageRef.child(file.name).getMetadata().then((metadata) => {
          // Metadata now contains the metadata for 'filepond/${file.name}'
          let downloadURL = '';
          this.storageRef.child(file.name).getDownloadURL().then( url =>{
            // console.log('download url: ',url);
            let metadataFile = { 
              name: metadata.name, 
              size: metadata.size, 
              contentType: metadata.contentType, 
              fullPath: metadata.fullPath,
              downloadURL: url,
              uploadDate: new Date()
          }

          //Process save metadata

          // this.databaseRef.

          const db = firebaseConfig.firestore();

          db.collection('users/'+this.props.status.details.uid+'/files').add({
            metadataFile
          });
          db.collection('users/'+this.props.status.details.uid+'/log').add({
            action: `${file.name} uploaded`,
            timestamp: new Date()
          })  
          
          })
          

      }).catch(function(error) {
        console.log(error)
      });
    })
}

  render() {
    const {classes} = this.props;

    if (this.props.status.details !== undefined && this.props.status.details !== null) {
      return (
        <>
          <div  className={classes.root}>
            {/* Pass FilePond properties as attributes */}
            <FilePond
              ref={ref => (this.pond = ref)}
              files={this.state.files}
              allowMultiple={true}
              maxFiles={3}
              server = {{process :  this . handleProcessing . bind ( this  )}}
              oninit={() => this.handleInit()}
            
            >
              { this.state.files.map(file=> (
                    <File key = {file} source = {file} />
                  ))}
            </FilePond>
          </div>

          <ImagesView status={this.props.status} {...this.props} />
        </>
      );
    }
    else {
      return null;
    }
  }
}

FileUploader.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(FileUploader);