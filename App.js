import {bundleResourceIO} from "@tensorflow/tfjs-react-native";
import { BinaryFile } from 'react-native-binary-file';
import model from './assets/model/model.json';

 //Loading model from models folder
  const modelJSON = model; //require('../assets/model/model.json');
  //require('./assets/model/group1-shard1of1.bin');

//C:\Users\Sadiy\OneDrive\Documents\rn-classifier-app\assets\model\model.json
//assets\model\model.json
// Load the model from the models folder
  const loadModel = async () => {
    const modelWeights = await BinaryFile.open('./assets/model/group1-shard1of1.bin');
    const model = await tf
      .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
      .catch(e => console.log(e));
    console.log("Model loaded!");
    return model;
  };

// import React, {Component} from 'react';
// import {StyleSheet, Text, View } from 'react-native';
// import { RNCamera } from 'react-native-camera-tflite';
// import outputs from './Output.json';
// import _ from 'lodash';
// let _currentInstant = 0;
// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       time: 0,
//       output: ""
//     };
//   }
//     processOutput({data}) {
//     const probs = _.map(data, item => _.round(item/255.0, 0.02));
//     const orderedData = _.chain(data).zip(outputs).orderBy(0, 'desc').map(item => [_.round(item[0]/255.0, 2), item[1]]).value();
//     const outputData = _.chain(orderedData).take(3).map(item => `${item[1]}: ${item[0]}`).join('\n').value();
//     const time = Date.now() - (_currentInstant || Date.now());
//     const output = `Guesses:\n${outputData}\nTime:${time} ms`;
//     this.setState(state => ({
//       output
//     }));
//     _currentInstant = Date.now();
//   }

//   render() {
//     const modelParams = {
//       file: "model.tflite",
//       inputDimX: 256,
//       inputDimY: 256,
//       outputDim: 1001,
//       freqms: 0
//     };
//     return (
//       <View style={styles.container}>
//         <RNCamera
//             ref={ref => {
//                 this.camera = ref;
//               }}
//             style = {styles.preview}
//             type={RNCamera.Constants.Type.back}
//             flashMode={RNCamera.Constants.FlashMode.on}
//             permissionDialogTitle={'Permission to use camera'}
//             permissionDialogMessage={'We need your permission to use your camera phone'}
//             onModelProcessed={data => this.processOutput(data)}
//             modelParams={modelParams}
//         >
//           <Text style={styles.cameraText}>{this.state.output}</Text>
//         </RNCamera>
//       </View>
//     );
//   }
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: 'black'
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   cameraText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold'
//   }
// });

// import React from 'react'
// import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity, Image} from 'react-native'
// import * as tf from '@tensorflow/tfjs'
// import { fetch } from '@tensorflow/tfjs-react-native'
// import * as mobilenet from '@tensorflow-models/mobilenet'
// import Constants from 'expo-constants'
// import * as Permissions from 'expo-permissions'
// import * as jpeg from 'jpeg-js'
// import * as ImagePicker from 'expo-image-picker'

// class App extends React.Component {
//   state = {
//     isTfReady: false,
//     isModelReady: false,
//     predictions: null,
//     image: null
//   }

//   async componentDidMount() {
//     await tf.ready()
//     this.setState({
//       isTfReady: true
//     })
//     this.model = await mobilenet.load()
//     this.setState({ isModelReady: true })
//     this.getPermissionAsync()

//     //Output in Expo console
//     //console.log(this.state.isTfReady)
//   }

//   getPermissionAsync = async () => {
//     if (Constants.platform.ios) {
//       const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
//       if (status !== 'granted') {
//         alert('Sorry, we need camera roll permissions to make this work!')
//       }
//     }
//   }

//   classifyImage = async () => {
//     try {
//       const imageAssetPath = Image.resolveAssetSource(this.state.image)
//       const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
//       const rawImageData = await response.arrayBuffer()
//       const imageTensor = this.imageToTensor(rawImageData)
//       const predictions = await this.model.classify(imageTensor)
//       this.setState({ predictions })
//       console.log(predictions)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   imageToTensor(rawImageData) {
//     const TO_UINT8ARRAY = true
//     const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
//     // Drop the alpha channel info for mobilenet
//     const buffer = new Uint8Array(width * height * 3)
//     let offset = 0 // offset into original data
//     for (let i = 0; i < buffer.length; i += 3) {
//       buffer[i] = data[offset]
//       buffer[i + 1] = data[offset + 1]
//       buffer[i + 2] = data[offset + 2]

//       offset += 4
//     }

//     return tf.tensor3d(buffer, [height, width, 3])
//   }

//   selectImage = async () => {
//     try {
//       let response = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3]
//       })
  
//       if (!response.cancelled) {
//         const source = { uri: response.uri }
//         this.setState({ image: source })
//         this.classifyImage()
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   renderPrediction = prediction => {
//     return (
//       <Text key={prediction.className} style={styles.text}>
//         {prediction.className}
//       </Text>
//     )
//   }

//   render() {
//     const { isTfReady, isModelReady, predictions, image } = this.state

//     return (
//       <View style={styles.container}>
//         <StatusBar barStyle='light-content' />
//         <View style={styles.loadingContainer}>
//           <Text style={styles.commonTextStyles}>
//             TFJS ready? {isTfReady ? <Text>✅</Text> : ''}
//           </Text>

//           <View style={styles.loadingModelContainer}>
//             <Text style={styles.text}>Model ready? </Text>
//             {isModelReady ? (
//               <Text style={styles.text}>✅</Text>
//             ) : (
//               <ActivityIndicator size='small' />
//             )}
//           </View>
//         </View>
//         <TouchableOpacity
//           style={styles.imageWrapper}
//           onPress={isModelReady ? this.selectImage : undefined}>
//           {image && <Image source={image} style={styles.imageContainer} />}

//           {isModelReady && !image && (
//             <Text style={styles.transparentText}>Tap to choose image</Text>
//           )}
//         </TouchableOpacity>
//         <View style={styles.predictionWrapper}>
//           {isModelReady && image && (
//             <Text style={styles.text}>
//               Predictions: {predictions ? '' : 'Predicting...'}
//             </Text>
//           )}
//           {isModelReady &&
//             predictions &&
//             predictions.map(p => this.renderPrediction(p))}
//         </View>
//         {/* <View style={styles.footer}>
//           <Text style={styles.poweredBy}>Powered by:</Text>
//           <Image source={require('./assets/tfjs.jpg')} style={styles.tfLogo} />
//         </View> */}
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#171f24',
//     alignItems: 'center'
//   },
//   loadingContainer: {
//     marginTop: 80,
//     justifyContent: 'center'
//   },
//   text: {
//     color: '#ffffff',
//     fontSize: 16
//   },
//   loadingModelContainer: {
//     flexDirection: 'row',
//     marginTop: 10
//   },
//   imageWrapper: {
//     width: 280,
//     height: 280,
//     padding: 10,
//     borderColor: '#cf667f',
//     borderWidth: 5,
//     borderStyle: 'dashed',
//     marginTop: 40,
//     marginBottom: 10,
//     position: 'relative',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   imageContainer: {
//     width: 250,
//     height: 250,
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     bottom: 10,
//     right: 10
//   },
//   predictionWrapper: {
//     height: 100,
//     width: '100%',
//     flexDirection: 'column',
//     alignItems: 'center'
//   },
//   transparentText: {
//     color: '#ffffff',
//     opacity: 0.7
//   },
//   footer: {
//     marginTop: 40
//   },
//   poweredBy: {
//     fontSize: 20,
//     color: '#e69e34',
//     marginBottom: 6
//   },
//   tfLogo: {
//     width: 125,
//     height: 70
//   }
// })

// export default App
