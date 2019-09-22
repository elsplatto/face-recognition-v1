import * as faceapi from 'face-api.js';

const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
const TINY_FACE_DETECTOR = 'tiny_face_detector'
const MTCNN = 'mtcnn'

let selectedFaceDetector = SSD_MOBILENETV1

// ssd_mobilenetv1 options
let minConfidence = 0.5

// tiny_face_detector options
let inputSize = 512
let scoreThreshold = 0.5

//mtcnn options
let minFaceSize = 20

function getFaceDetectorOptions() {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : (
      selectedFaceDetector === TINY_FACE_DETECTOR
        ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
        : new faceapi.MtcnnOptions({ minFaceSize })
    )
}

export async function loadModels() {
  console.log('Load Model');
  const MODEL_URL = process.env.PUBLIC_URL;
  // console.log('process.env',process.env);
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
  
}



export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  let scoreThreshold = 0.5;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold
  });
  const useTinyModel = true;

  console.log('blob:', blob)
  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors();
  return fullDesc;
}

export async function getAgeAndGender(imgObj) {
  const MODEL_URL = process.env.PUBLIC_URL;
  await getCurrentFaceDetectionNet().load(MODEL_URL)
  const options = getFaceDetectorOptions();
  console.log('options:', options);
  const results = await faceapi.detectAllFaces(imgObj, options)
    // compute face landmarks to align faces for better accuracy
    .withFaceLandmarks()
    .withAgeAndGender()
}


function getCurrentFaceDetectionNet() {
  return faceapi.nets.ssdMobilenetv1
  
}

function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params
}
  