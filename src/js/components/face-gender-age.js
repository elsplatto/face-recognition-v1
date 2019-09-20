import React from 'react';
import firebaseConfig from '../utilities/firebase-config';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

import { loadModels, getFullFaceDescription, getAgeAndGender } from '../utilities/face';


const INIT_STATE = {
  imageURL: null,
  fullDesc: null,
  detections: null
};

const styles = theme => ({
  root: {
    position: 'relative',
    flexGrow: 1,
    marginTop: theme.spacing(10)
  },
  circProgress: {
    width: '44px',
    height: '44px'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0
  }
});

class FaceGenderAge extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INIT_STATE };
  }

  // componentDidMount() {
    
  // }

  componentDidMount = async () => {

    console.log('Component mounted uid: ', this.props);
    console.log('Component mounted params: ', this.props.match.params.fileId);

    if (this.props.status.details !== undefined && this.props.status.details !== null) {
      this.retrieveImage();
    }
    
  };

  componentDidUpdate(prevProps, prevState) {
   
    if ((prevProps.status.details === undefined || prevProps.status.details === null) && (this.props.status.details !== undefined || this.props.status.details !== null))
    {
      console.log('Component updated: ', this.props);
      console.log('Component updated uid: ', this.props.status.details.uid);
      this.retrieveImage();
    }
  }

  retrieveImage = async () => {
    const db = firebaseConfig.firestore();
    const $this = this;

    await db.collection('users/'+this.props.status.details.uid+'/files').doc(this.props.match.params.fileId).get().then(function(doc) {
        if (doc.exists) {
          console.log(doc.data())
          $this.setState({
            imageURL: doc.data().metadataFile.downloadURL
          })
        }
      }).then(async () =>  {
        // console.log('imageURL', $this.state.imageURL);        
      })

    await loadModels();
    await $this.handleImage($this.state.imageURL);
  }

  handleImage = async (image = this.state.imageURL) => {
    await getFullFaceDescription(image).then(fullDesc => {
      console.log(fullDesc);
      this.setState({ 
        fullDesc,
        detections: fullDesc.map(fd => fd.detection)
       });
    });

    const img = document.getElementById('image');
    console.log('Image:', img);

    const results = await getAgeAndGender(img);
  };

  render() {
    const { imageURL, detections } = this.state;
    const {classes} = this.props;
    if (imageURL)
    {

      let drawBox = null;
      if (!!detections) {
        drawBox = detections.map((detection, i) => {
          
          let _H = detection.box.height;
          let _W = detection.box.width;
          let _X = detection.box._x;
          let _Y = detection.box._y;
          if (detection.classScore > 0.6)
          {
            return (
              <div style={{
                // borderColor: 'red',
                // borderStyle: 'dashed',
                position: 'absolute'
              }} key={i}>
                <div
                  style={{
                    zIndex: 100,
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
          }
        });
      }

      return (
        <Grid container className={classes.root} spacing={0}>
          <img src={imageURL} alt="imageURL" id="image" />
          <canvas id="overlay" className={classes.overlay} />
          {!!drawBox ? drawBox : null}
        </Grid>
      )
    }
    else {
      return (
      <Grid className={classes.root} container>
        <CircularProgress className={classes.circProgress} />
      </Grid>
      )
    }
    
  }
}

FaceGenderAge.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(FaceGenderAge);