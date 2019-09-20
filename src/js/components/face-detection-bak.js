import React from 'react';
import firebaseConfig from '../utilities/firebase-config';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { loadModels, getFullFaceDescription } from '../utilities/face';


const INIT_STATE = {
  imageURL: null,
  fullDesc: null,
  detections: null
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(10)
  }
});

class FaceDetection extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INIT_STATE };
  }

  // componentDidMount() {
    
  // }

  componentDidMount = async () => {

    console.log('Component mounted uid: ', this.props.status.details.uid);
    console.log('Component mounted params: ', this.props.match.params.fileId);

    const db = firebaseConfig.firestore();
    const $this = this;

    db.collection('users/'+this.props.status.details.uid+'/files').doc(this.props.match.params.fileId).get().then(function(doc) {
      if (doc.exists) {
        console.log(doc.data())
        $this.setState({
          imageURL: doc.data().metadataFile.downloadURL
        })
      }
    }).then(async () =>  {
      console.log('imageURL', $this.state.imageURL)
      await loadModels();
      await $this.handleImage($this.state.imageURL);
    })

    console.log('params:', this.props.match.params.fileId);
    
    
  };

  // handleImage = async (image = this.state.imageURL) => {
  //   await getFullFaceDescription(image).then(fullDesc => {
  //     console.log(fullDesc);
  //     this.setState({ fullDesc });
  //   });
  // };

  handleImage = async (image = this.state.imageURL) => {
    await getFullFaceDescription(image).then(fullDesc => {
      if (!!fullDesc) {
        this.setState({
          fullDesc,
          detections: fullDesc.map(fd => fd.detection)
        });
      }
    });
  };

  handleFileChange = async event => {
    this.resetState();
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0]),
      loading: true
    });
    this.handleImage();
  };

  resetState = () => {
    this.setState({ ...INIT_STATE });
  };

  render() {
    const { imageURL, detections } = this.state;
    const {classes} = this.props;

    let drawBox = null;
    if (!!detections) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: 'blue',
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`
              }}
            />
          </div>
        );
      });
    }

    return (
      <Grid container className={classes.root} spacing={0}>
        <img src={imageURL} width="25%" height="auto" alt="imageURL" />
        {!!drawBox ? drawBox : null}
      </Grid>
    )
  }
}

FaceDetection.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(FaceDetection);