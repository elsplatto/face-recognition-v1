import React from 'react';
import firebaseConfig from '../utilities/firebase-config';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import RemoveCircle  from '@material-ui/icons/RemoveCircle';
import Visibility  from '@material-ui/icons/Visibility';
import Face  from '@material-ui/icons/Face';


import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(10)
  },
  item: {
    position: 'relative',
    paddingBottom: 30
  },
  remove: {
    position: 'absolute',
    left: -30,
    top: -15,
    zIndex: 10
  },
  visibility: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 10
  },
  face: {
    position: 'absolute',
    right: 50,
    bottom: 0,
    zIndex: 10
  }
});


class ImagesView extends React.Component {
  constructor(props) {
    super(props);
    this.imageObjectUnsubscribe = null;

    this.state = {
      images: null
    }
  }

  componentDidMount() {
    const db = firebaseConfig.firestore();
    let imageQuery = null;
    let imageObj = null;
    const $this = this;

    imageQuery = db.collection('users/'+this.props.status.details.uid+'/files');

    this.imageObjectUnsubscribe = imageQuery.onSnapshot(snapshot => {
      let imageArr = [];      
      snapshot.forEach(function(doc) {
        console.log('doc id', doc.id );
        imageObj = doc.data().metadataFile
        imageObj.id = doc.id;

        imageArr.push(imageObj);
        // console.log('doc', doc.data())
      });
      // console.log('imageArr: ', imageArr);
      $this.setState({
        images: imageArr
      })
    })
  }

  componentWillUnmount() {
  	this.imageObjectUnsubscribe()
  } 

  handleDetail(e) {
    let targetTag = e.target.tagName.toLowerCase();
    let target = e.target;
    if (targetTag !== 'button') {
      target = target.closest('button');
    }
    const fileId = target.dataset.imageid;
    // console.log('fileId:', fileId);
    // console.log('props:', this.props);
    // console.log('history:', this.props.history);
    // console.log('fileId:', fileId);
    this.props.history.push('/face-detection/'+fileId);
  }

  handleDetail2(e) {
    let targetTag = e.target.tagName.toLowerCase();
    let target = e.target;
    if (targetTag !== 'button') {
      target = target.closest('button');
    }
    const fileId = target.dataset.imageid;
    // console.log('fileId:', fileId);
    // console.log('props:', this.props);
    // console.log('history:', this.props.history);
    // console.log('fileId:', fileId);
    this.props.history.push('/face-gender-age/'+fileId);
  }

  handleRemove(e) {
    let targetTag = e.target.tagName.toLowerCase();
    let target = e.target;
    if (targetTag !== 'button') {
      target = target.closest('button');
    }
    const fileId = target.dataset.imageid;
    const imagePath = target.dataset.path;
    const db = firebaseConfig.firestore();
    const fileRef = firebaseConfig.storage().ref().child(imagePath);
    fileRef.delete().then(function(){

    }).catch(function(error) {
      // Uh-oh, an error occurred!
    });

    db.collection('users/'+this.props.status.details.uid+'/files').doc(fileId).delete().then(function(){
      // console.log('database entry deleted');
    }).catch(function(error) {
      // console.log('error', error)
    });

    db.collection('users/'+this.props.status.details.uid+'/log').add({
      action: `${imagePath} deleted`,
      timestamp: new Date()
    })  
  }

  render() {
    const {classes} = this.props;

    if (this.state.images) {
      let imageList = this.state.images.map((image,i) => {
        console.log('image',image)
        return (
	      	<Grid className={classes.item} item key={i} xs={12} sm={6} md={4} lg={3} xl={2}>
             <Button className={classes.remove} onClick={this.handleRemove.bind(this)} data-imageid={image.id} data-path={image.fullPath}>
                <RemoveCircle />
              </Button>
              <Button className={classes.visibility} onClick={this.handleDetail.bind(this)} data-imageid={image.id} data-path={image.fullPath}>
                <Visibility />
              </Button>
              <Button className={classes.face} onClick={this.handleDetail2.bind(this)} data-imageid={image.id} data-path={image.fullPath}>
                <Face />
              </Button>
            <img src={image.downloadURL} width="100%" height="auto" />
          </Grid>
        )
      })
      return (
        <Grid item xs={12} container={true}>
          {imageList}
        </Grid>
      )
    }
    else {
      return null;
    }   
  }
}

ImagesView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImagesView);