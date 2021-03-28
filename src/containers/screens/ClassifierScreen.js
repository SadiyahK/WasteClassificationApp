/**
 * ClassifierScreen: Controls classification feature and handles use of model.
 * The code for loading the model and formatting the image tensor were inspired by this post written by Lin Xiang
 * https://javascript.plainenglish.io/how-to-run-ai-models-locally-in-the-smartphone-with-react-native-and-tensorflow-js-666f52fd15ca
 */
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, Alert} from 'react-native'
import * as tf from '@tensorflow/tfjs'
import * as ImagePicker from 'expo-image-picker';
//import { FileSystem } from 'expo'
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';
import React, { useState, useEffect }  from 'react';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import {vw, vh} from 'react-native-viewport-units';

class ClassifierScreen extends React.Component {
    state = {
        isTfReady: false,
        isModelReady: false,
        predictions: null,
        image: null,
        results: null,
    }

    // Initial setup of tensorflow and model
    async componentDidMount() {
        //Wait for tensorflow module to be ready
        await tf.ready()
        this.setState({ isTfReady: true })
        console.log("[+] Loading custom waste classification model")

        // load model - inspired by Lin Xiang's code (linked above)
        const modelJson = await require("../..//assets/model/model.json")
        const modelWeight = await require("../../assets/model/group1-shard1of1.bin")
        this.wasteDetector = await tf.loadLayersModel(bundleResourceIO(modelJson,modelWeight))

        console.log("[+] Model Loaded")
        this.setState({ isModelReady: true })
        this.getPermissionAsync()
    }

    // Handles camera permissions
    getPermissionAsync = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera  permissions to make this work!');
            }
          }
    }    

    // Classify input image and get predictions
    classifyImage = async () => {
        try {
            const imgAssetPath = Image.resolveAssetSource(this.state.image)
            const imgB64 = await FileSystem.readAsStringAsync(imgAssetPath.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            //const fetchedResponse = await fetch(imgAssetPath.uri, {}, { isBinary: true })
            //const rawImgData = await imgB64.arrayBuffer()
            const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
            const imgTensor = this.convertImageToTensor(imgBuffer)
            const predictions = await this.wasteDetector.predict(imgTensor)
            this.getPrediction(predictions)
        } catch (error) {
            console.log(error)
            Alert.alert("Sorry, unable to classify this. Please try again")
        }
    }

    // sort array based on second array
    mapArrays(arr1, arr2){
        return arr1.map((item, index) => [arr2[index], item]) // add the args to sort by
            .sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
            .map(([, item]) => item); // extract the sorted items
    }

    // take numerical predictions and get string values
    getPrediction(predictions){
        // format predictions to string classes
        const classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
        // {'cardboard': 0, 'glass': 1, 'metal': 2, 'paper': 3, 'plastic': 4, 'trash': 5}
        const orderedClasses = this.mapArrays(classes, predictions.dataSync());
        predictions.dataSync().sort()
        this.setState({ predictions })
        this.setState({results: orderedClasses})
    }

    // reformat tensor to match expected intput for model
    // Method inspired by Lin Xiang's code (linked above)
    formatTensor(img){
        const resized_img = tf.image.resizeBilinear(img, [256, 256]);
        // add a fourth batch dimension to the tensor
        const expanded_img = resized_img.expandDims(0);
        // normalise the rgb values to -1-+1
        return expanded_img.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    }

    // Convert input image to tensor so model can process it
    // Method inspired by Lin Xiang's code (linked above)
    convertImageToTensor(rawImageData) {
        const TO_UINT8ARRAY = true
        const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
        const buffer = new Uint8Array(width * height * 3)
        let offset = 0 // offset into original data
        for (let i = 0; i < buffer.length; i += 3) {
            buffer[i] = data[offset]
            buffer[i + 1] = data[offset + 1]
            buffer[i + 2] = data[offset + 2]
            offset += 4
        }
        const img = tf.tensor3d(buffer, [height, width, 3]) //create tensor
        return this.formatTensor(img)
    }

    // Handles opening camera and storing image taken.
    onCamClick = async () => {
        try{
            let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            base64: false
            });  
            // if image is taken then store it and classify it.      
            if (!result.cancelled) {
                const source = { uri: result.uri }
                this.setState({
                    image:source
                });
                this.classifyImage()
            }
        }catch (error) {
            console.log(error)
            Alert.alert("There was an issue taking the picture. Please try again!")
        }
    };

    // onResetClick placeholders for next classification
    onResetClick(event) {
        this.setState({ predictions: null})
        this.setState({results: null})
        this.setState({image: null})
    }

    // display alert if user tries to open camera
    // model is not ready
    onCamViewNotReadyClick = () =>{
        Alert.alert("Please wait for the model to load before trying to take an image")
    }

    render() {
        const { isTfReady, isModelReady, predictions, image, wasteDetector, results} = this.state

        return (
            <View style={styles.container}>
                
            {/* Description helper text */}
            <View style={styles.descriptionContainer}>
                <Text style={styles.descBox}>Once the model has loaded tap the green box to take a picture to classify!</Text>
            </View>

            {/* pick + display image */}
            <TouchableOpacity
                testID="classifier.CameraDisplay"
                style={styles.imageWrapper}
                onPress={isModelReady ? this.onCamClick : this.onCamViewNotReadyClick}>
                
                {image && <Image source={image} style={styles.imageContainer} />}
                
                {!isModelReady? 
                (<View><Text style={styles.commonTextStyles}>Waiting for Model to Load</Text>
                    <ActivityIndicator size="small" color="#8FD14F" /></View>
                )  : undefined}

                {isModelReady && !image && (
                    <Text onPress={this.onCamClick} style={styles.commonTextStyles}>Tap to open camera</Text>
                )}
            </TouchableOpacity>

            {/* Display predictions */}      
            <View style={styles.predictionWrapper}>
                
                {!image && (
                    <Text style={styles.commonTextWhite}>
                        Take a picture to get predictions! </Text>
                )}
                
                {isModelReady && image && (
                   <Text style={styles.commonTextWhite}>
                        Prediction:   {predictions ? '' : <ActivityIndicator size="small" color="#8FD14F" />}
                    </Text>
                )}
                
                {isModelReady &&
                predictions &&
                results &&
                <Text style={styles.commonTextWhite}>
                    Most Likely: {
                    results[0].charAt(0).toUpperCase() + results[0].slice(1)}{"\n"} 
                    Probability: {((predictions.dataSync()[5]*100).toPrecision(3))}{"%"}
                    {/* 2nd: {(results[1])}{"  "} --Probability: {(predictions.dataSync()[4].toPrecision(4))}{"\n"}
                    3rd: {(results[2])}{"  "} --Probability: {(predictions.dataSync()[3].toPrecision(4))}                        */}
                </Text>}
            </View>

            {/* onResetClick button */}
            <TouchableOpacity onPress={(e) => this.onResetClick(e)} style={styles.appButtonContainer}>
            <Text style={ styles.button } onPress={(e) => this.onResetClick(e)}>Reset</Text>
            </TouchableOpacity>
            
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        alignItems: 'stretch',
        color: '#FFFEF2'
    },
    descriptionContainer: {
        flex: 1,
        marginTop: vh*2,
        marginLeft: vh*2,
        marginRight: vh*2,
        backgroundColor: 'rgba(52, 52, 52, 0.40)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    descBox: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontFamily: 'System',
        fontWeight: 'bold'
    },
    imageWrapper: {
        flex: 4,
        borderColor: '#8FD14F',
        borderWidth: vh*0.65,//6,
        borderStyle: 'dashed',
        marginTop: vh*3,
        marginBottom: vh*3,
        marginLeft: vh*5,
        marginRight: vh*5,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        position: 'absolute',
        alignItems: 'center',
        top: vh*1,
        left: vh*1,
        bottom: vh*1,
        right: vh*1,
    },
    predictionWrapper: {
        flex: 1,
        marginLeft: vh*2,
        marginRight: vh*2,
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.40)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    appButtonContainer:{
        flex: 0.4,
        marginTop: vh*2,
        marginBottom: vh*10,
        backgroundColor: '#8FD14F',
        borderRadius: vh*1,
        paddingVertical: vh*0.7,
        marginLeft: vh*15,
        marginRight: vh*15,
        justifyContent: 'center',

    },  
    button:{
        color: '#FFFEF2',
        fontSize: vw*4,
        fontWeight: "bold",
        alignSelf: "center",
    },
    commonTextStyles:{
        fontFamily: 'System',
        fontWeight: 'bold',
        alignItems: 'center',
    },
    commonTextWhite:{
        fontFamily: 'System',
        fontWeight: 'bold',
        alignItems: 'center',
        color: '#FFFEF2',
        textAlign: 'center',
    },
})

export default ClassifierScreen