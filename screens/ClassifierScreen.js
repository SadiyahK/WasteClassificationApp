import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity, Image, Button} from 'react-native'
import * as tf from '@tensorflow/tfjs'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as jpeg from 'jpeg-js'
import * as ImagePicker from 'expo-image-picker'
import React, { useState, useEffect }  from 'react';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { color } from 'react-native-reanimated'
import firebase from '../database/firebase';

class ClassifierScreen extends React.Component {
    state = {
        isTfReady: false,
        isModelReady: false,
        predictions: null,
        image: null,
        results: null,
        
    }

    async componentDidMount() {

        console.log("[+] Application started")
        //Wait for tensorflow module to be ready
        await tf.ready();
        this.setState({
            isTfReady: true
        })
        console.log("[+] Loading custom waste classification model")
        //Replce model.json and group1-shard.bin with your own custom model
        const modelJson = await require("../assets/model/model.json");
        const modelWeight = await require("../assets/model/group1-shard1of1.bin");
        this.wasteDetector = await tf.loadLayersModel(bundleResourceIO(modelJson,modelWeight));
        console.log("[+] Loading trained waste detection model")
        console.log("[+] Model Loaded")
        this.setState({ isModelReady: true })
        this.getPermissionAsync()
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!')
            }
        }
    }

    classifyImage = async () => {
        try {
            const imageAssetPath = Image.resolveAssetSource(this.state.image)
            const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
            const rawImageData = await response.arrayBuffer()
            const imageTensor = this.imageToTensor(rawImageData)
            const predictions = await this.wasteDetector.predict(imageTensor)
            
            const number_to_class = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
            const dsu = (arr1, arr2) => arr1
                .map((item, index) => [arr2[index], item]) // add the args to sort by
                .sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
                .map(([, item]) => item); // extract the sorted items

            const results = dsu(number_to_class, predictions.dataSync());
            const p = predictions.dataSync()
            p.sort()
            this.setState({ predictions })
            this.setState({results})
            this.writeUserData(results[0])
            // for(i = 0; i < 3; i++){
            //     this.writeUserData(results[i])
            // }
        } catch (error) {
            console.log(error)
        }
    }

    imageToTensor(rawImageData) {
        const TO_UINT8ARRAY = true
        const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
        // Drop the alpha channel info for mobilenet
        const buffer = new Uint8Array(width * height * 3)
        let offset = 0 // offset into original data
        for (let i = 0; i < buffer.length; i += 3) {
            buffer[i] = data[offset]
            buffer[i + 1] = data[offset + 1]
            buffer[i + 2] = data[offset + 2]
            offset += 4
        }

        const img = tf.tensor3d(buffer, [height, width, 3])
        const resized_img = tf.image.resizeBilinear(img, [256, 256]);

        // add a fourth batch dimension to the tensor
        const expanded_img = resized_img.expandDims(0);

        // normalise the rgb values to -1-+1
        return expanded_img.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    }

    selectImage = async () => {
        try {
            let response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3]
            })

            if (!response.cancelled) {
                const source = { uri: response.uri }
                this.setState({ image: source })
                this.classifyImage()
            }
        } catch (error) {
            console.log(error)
        }
    }

    writeUserData(data) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              console.log('user logged')
              var date = new Date().getDate(); //To get the Current Date
              var month = new Date().getMonth() + 1; //To get the Current Month
              var year = new Date().getFullYear(); //To get the Current Year
              var hours = new Date().getHours(); //Current Hours
              var min = new Date().getMinutes(); //Current Minutes
              var sec = new Date().getSeconds(); //Current Seconds
              var fullDate = date + '/' + month + '/' + year 
              + ' ' + hours + ':' + min + ':' + sec
      
              const userId = firebase.auth().currentUser.uid
              firebase.database().ref('users/' + userId).update({
                fullDate: data,
              })
              .then(() => console.log('Data updated.'));
            }
         });
      }

    reset(event) {
        this.setState({ predictions: null})
        this.setState({results: null})
        this.setState({image: null})
    }

    render() {
        const { isTfReady, isModelReady, predictions, image, wasteDetector, results} = this.state

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content' />
                <View style={styles.loadingContainer}>
                    <Text style={styles.descBox}>Select an image from your gallery to classify!</Text>
                </View>
                <TouchableOpacity
                    style={styles.imageWrapper}
                    onPress={isModelReady ? this.selectImage : undefined}>
                    {image && <Image source={image} style={styles.imageContainer} />}
                    {!isModelReady? 
                    (<Text style={styles.commonTextStyles}>Waiting for Model to Load...</Text>)  : undefined}
                    {isModelReady && !image && (
                        <Text style={styles.commonTextStyles}>Tap to choose an image</Text>
                    )}
                </TouchableOpacity>
                <View style={styles.predictionWrapper}>
                    {!image && (
                        <Text style={styles.commonTextWhite}>
                            Predictions... </Text>
                    )}
                    {isModelReady && image && (
                        <Text style={styles.commonTextWhite}>
                            Predictions: {predictions ? '' : 'Predicting...'}
                        </Text>
                    )}
                    {isModelReady &&
                    predictions &&
                    results &&
                    <Text style={styles.commonTextWhite}>
                        1st: {results[0]}{"  "} --Probability: {(predictions.dataSync()[5].toPrecision(4))}{"\n"}
                        2nd: {(results[1])}{"  "} --Probability: {(predictions.dataSync()[4].toPrecision(4))}{"\n"}
                        3rd: {(results[2])}{"  "} --Probability: {(predictions.dataSync()[3].toPrecision(4))}                       
                    </Text>}
                </View>
                <TouchableOpacity onPress={(e) => this.reset(e)} style={styles.appButtonContainer}>
                <Text style={ styles.button } onPress={(e) => this.reset(e)}>Reset</Text>
                </TouchableOpacity>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        color: '#FFFEF2'
    },
    appButtonContainer:{
        marginTop: 10,
        elevation: 8,
        backgroundColor: '#8FD14F',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,

    },    
    button:{
        color: '#FFFEF2',
        width: '20%',
        fontSize: 18,
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
    },
    loadingContainer: {
        marginTop: 10,
        // backgroundColor: '#767676',
        backgroundColor: 'rgba(52, 52, 52, 0.45)',
        justifyContent: 'center',
        width: '95%',
        height: '5%',
        alignItems: 'center',
    },
    text: {
        color: '#ffffff',
        fontSize: 16
    },
    loadingModelContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    descBox: {
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: 18,
        fontFamily: 'System',
        fontWeight: 'bold'
    },
    imageWrapper: {
        width: '80%',
        height: '50%',
        padding: 10,
        borderColor: '#8FD14F',
        borderWidth: 6,
        borderStyle: 'dashed',
        marginTop: 40,
        marginBottom: 20,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        position: 'absolute',
        alignItems: 'center',
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
    },
    predictionWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        // backgroundColor: '#767676',
        backgroundColor: 'rgba(52, 52, 52, 0.45)',
        justifyContent: 'center',
        width: '80%',
        height: '13%',
        alignItems: 'center',
    }
})

export default ClassifierScreen