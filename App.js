import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity, Image} from 'react-native'
import * as tf from '@tensorflow/tfjs'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as jpeg from 'jpeg-js'
import * as ImagePicker from 'expo-image-picker'
import React, { useState, useEffect }  from 'react';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';

class App extends React.Component {
    state = {
        isTfReady: false,
        isModelReady: false,
        predictions: null,
        image: null,
        results: null
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
        const modelJson = await require("./assets/model/model.json");
        const modelWeight = await require("./assets/model/group1-shard1of1.bin");
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

    render() {
        const { isTfReady, isModelReady, predictions, image, wasteDetector, results} = this.state

        return (
            <View style={styles.container}>
                <StatusBar barStyle='light-content' />
                <View style={styles.loadingContainer}>
                    <Text style={styles.commonTextStyles}>
                        TFJS ready? {isTfReady ? <Text>✅</Text> : ''}
                    </Text>

                    <View style={styles.loadingModelContainer}>
                        <Text style={styles.commonTextStyles}>Model ready? </Text>
                        {isModelReady ? (
                            <Text>✅</Text>
                        ) : (
                            <ActivityIndicator size='small' />
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.imageWrapper}
                    onPress={isModelReady ? this.selectImage : undefined}>
                    {image && <Image source={image} style={styles.imageContainer} />}

                    {isModelReady && !image && (
                        <Text style={styles.commonTextStyles}>Tap to choose image</Text>
                    )}
                </TouchableOpacity>
                <View style={styles.predictionWrapper}>
                    {isModelReady && image && (
                        <Text style={styles.text}>
                            Predictions: {predictions ? '' : 'Predicting...'}
                        </Text>
                    )}
                    {isModelReady &&
                    predictions &&
                    results &&
                    <Text style={styles.commonTextStyles}>
                        1st: {results[0]}{"  "} --Probability: {(predictions.dataSync()[5])}{"\n"}
                        2nd: {(results[1])}{"  "} --Probability: {(predictions.dataSync()[4])}{"\n"}
                        3rd: {(results[2])}{"  "} --Probability: {(predictions.dataSync()[3])}                       
                    </Text>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    loadingContainer: {
        marginTop: 80,
        justifyContent: 'center'
    },
    text: {
        color: '#ffffff',
        fontSize: 16
    },
    loadingModelContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    imageWrapper: {
        width: 280,
        height: 280,
        padding: 10,
        borderColor: '#000000',
        borderWidth: 5,
        borderStyle: 'dashed',
        marginTop: 40,
        marginBottom: 10,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        width: 250,
        height: 250,
        position: 'absolute',
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
    },
    predictionWrapper: {
        height: 100,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center'
    }
})

export default App
