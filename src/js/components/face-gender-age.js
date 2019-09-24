import React from 'react';
import firebaseConfig from '../utilities/firebase-config';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

// import { loadModels, getFullFaceDescription, getAgeAndGender } from '../utilities/face';

import * as faceapi from 'face-api.js';

const SSD_MOBILENETV1 = 'ssd_mobilenetv1';
const TINY_FACE_DETECTOR = 'tiny_face_detector';
const MTCNN = 'mtcnn';
const MODEL_URL = process.env.PUBLIC_URL;
let selectedFaceDetector = SSD_MOBILENETV1;
// ssd_mobilenetv1 options
let minConfidence = 0.5

// tiny_face_detector options
let inputSize = 512
let scoreThreshold = 0.5

//mtcnn options
let minFaceSize = 20


const INIT_STATE = {
  imageURL: null,
  fullDesc: null,
  detections: null,
  loading: true,
  descriptors: null
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
  linearProgress: {
    width: 500
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

  componentDidMount = async () => {

    console.log('Component mounted uid: ', this.props);
    console.log('Component mounted params: ', this.props.match.params.fileId);

    if (this.props.status.details !== undefined && this.props.status.details !== null) {
      this.retrieveImage();
      this.run();
    }
    
  };

  componentDidUpdate(prevProps, prevState) {
   
    if ((prevProps.status.details === undefined || prevProps.status.details === null) && (this.props.status.details !== undefined || this.props.status.details !== null))
    {
      console.log('Component updated: ', this.props);
      console.log('Component updated uid: ', this.props.status.details.uid);
      console.log('this.state.descriptors: ', this.state.descriptors);
      this.retrieveImage();
      this.run();
    }

    if (!prevState.descriptors  && this.state.descriptors) {
      console.log('this.state.descriptors: ', this.state.descriptors);
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
  }

  isFaceDetectionModelLoaded = () => {
    console.log('getCurrentFaceDetectionNet().params',this.getCurrentFaceDetectionNet().params)
    return !!this.getCurrentFaceDetectionNet().params
  }

  getCurrentFaceDetectionNet = () => {
    // if (selectedFaceDetector === SSD_MOBILENETV1) {
    //   return faceapi.nets.ssdMobilenetv1
    // }
    // if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    //   return faceapi.nets.tinyFaceDetector
    // }
    // if (selectedFaceDetector === MTCNN) {
    //   return faceapi.nets.mtcnn
    // }

    return faceapi.nets.ssdMobilenetv1;
  }

  getFaceDetectorOptions() {
    return selectedFaceDetector === SSD_MOBILENETV1
      ? new faceapi.SsdMobilenetv1Options({ minConfidence })
      : (
        selectedFaceDetector === TINY_FACE_DETECTOR
          ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
          : new faceapi.MtcnnOptions({ minFaceSize })
      )
  }

  updateResults = async () => {
    if (!this.isFaceDetectionModelLoaded()) {
      return
    }    
    // console.log('======================');
    // console.log('updateResults running');

    const inputImgEl = document.getElementById('image');
    const options = this.getFaceDetectorOptions();
    const canvas = document.getElementById('overlay');

    console.log('options:', options);    

    const results = await faceapi.detectSingleFace(inputImgEl, options)
      // compute face landmarks to align faces for better accuracy
      .withFaceLandmarks()
      .withAgeAndGender().withFaceDescriptor()
      // console.log('Results: ', results);
      // console.log('uid: ', this.props.status.details.uid);

    if (results) {
      // const faceMatcher = new faceapi.FaceMatcher(results);
      // console.log('faceMatcher: ', faceMatcher);
      // const bestMatch = faceMatcher.findBestMatch(results.descriptor);
      // console.log('Best Match: ', bestMatch);
      // console.log('Best Match: ', bestMatch.label);
      
      // const labeledDescriptors = new faceapi.LabeledFaceDescriptors(
      //   'jason',
      //   [results.descriptor]
      // )
      // console.log('Descriptor: ', results.descriptor);
      // console.log('Descriptor: ', Array.from(results.descriptor));
      // this.setState({
      //   descriptors: Array.from(results.descriptor)
      // })
      // console.log('labeledDescriptors: ', labeledDescriptors.descriptors);        
    }    
    
    
    

    
    faceapi.matchDimensions(canvas, inputImgEl);
    const resizedResults = faceapi.resizeResults(results, inputImgEl);
    faceapi.draw.drawDetections(canvas, resizedResults);
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults)
    

    console.log('Resized results: ', resizedResults);

    // resizedResults.forEach(result => {
      const { age, gender, genderProbability } = resizedResults
      new faceapi.draw.DrawTextField(
        [
          `${faceapi.round(age, 0)} years`,
          `${gender} (${faceapi.round(genderProbability)})`
        ],
        resizedResults.detection.box.bottomLeft
      ).draw(canvas);
    // })

    
    // console.log('Descriptors: ', descriptors);

    const descriptors = await faceapi.computeFaceDescriptor(inputImgEl);
    console.log('==========================');
    console.log('descriptors: ', descriptors);

    this.setState({
      loading: false,
      descriptors: Array.from(descriptors)
    })
  }

  changeFaceDetector = async(detector) => {    
    if (!this.isFaceDetectionModelLoaded()) {
      await this.getCurrentFaceDetectionNet().load(MODEL_URL)
    }
  }

  run = async () => {
    // console.log('======================');
    // console.log('RUN running');
    // load face detection and age and gender recognition models
    // and load face landmark model for face alignment
    // console.log('SSD_MOBILENETV1',SSD_MOBILENETV1)
    await this.changeFaceDetector(SSD_MOBILENETV1)
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.nets.ageGenderNet.load(MODEL_URL)

    // start processing image
   this.updateResults();
  }

  storeIdentityDatapoints() {
    const db = firebaseConfig.firestore();
    const $this = this;
    if (this.props.status !== undefined && this.props.status !== null) {
      console.log('Ok - store this data.')
      console.log('this.state.descriptors: ', $this.state.descriptors);
      db.collection('descriptors').add({
        descriptors: this.state.descriptors,
        uid: this.props.status.details.uid,
        imageURL: this.state.imageURL
      }).then(function() {
        $this.props.history.push('/');
      });
    }
  }

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
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <img crossOrigin="anonymous" src={imageURL} alt="imageURL" id="image" />
            <canvas id="overlay" className={classes.overlay} />
            {!!drawBox ? drawBox : null}
          </Grid>
          
          <Grid item xs={12}>
            {this.state.loading ? <LinearProgress color="secondary" className={classes.linearProgress} /> : <Button variant="contained" onClick={this.storeIdentityDatapoints.bind(this)}>Store</Button> }            
          </Grid>
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